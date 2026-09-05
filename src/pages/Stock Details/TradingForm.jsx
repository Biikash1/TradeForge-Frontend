import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DotIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserWallet } from "@/State/Wallet/ActionWallet";
import { getAssetDetails } from "@/State/Assets/ActionAssets";
import { payOrder } from "@/State/Order/ActionOrder";

const TradingForm = () => {
  const [orderType, setOrderType] = useState("BUY");
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const coinDetails = useSelector((store) => store.coin?.coinDetails);
  const userWallet = useSelector((store) => store.wallet?.userWallet);
  const assetDetails = useSelector((store) => store.asset?.assetDetails);

  // Fallback checks covering both backend DB entities and CoinGecko API responses
  const currentPrice =
    coinDetails?.market_data?.current_price?.usd ??
    coinDetails?.current_price ??
    0;

  // Defensive fallback lookup for coin images across nested objects & plain strings
  const coinImage =
    (typeof coinDetails?.image === "string" ? coinDetails.image : null) ||
    coinDetails?.image?.large ||
    coinDetails?.image?.small ||
    coinDetails?.image?.thumb ||
    coinDetails?.coin?.image ||
    "";

  const priceChangePercentage =
    coinDetails?.market_data?.price_change_percentage_24h ??
    coinDetails?.price_change_percentage_24h ??
    0;

  const priceChangeAmount =
    coinDetails?.market_data?.price_change_24h_in_currency?.usd ??
    coinDetails?.price_change_24h ??
    0;

  const isPositive = Number(priceChangePercentage) >= 0;

  // Calculates crypto units based on USD amount entered
  const calculateVolume = (val, price) => {
    const numericVal = parseFloat(val);
    const numericPrice = parseFloat(price);

    if (
      !numericVal ||
      isNaN(numericVal) ||
      !numericPrice ||
      isNaN(numericPrice) ||
      numericPrice <= 0
    ) {
      return "0";
    }

    const volume = numericVal / numericPrice;
    return volume >= 1 ? volume.toFixed(4) : volume.toFixed(6);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setAmount(val);
    setQuantity(calculateVolume(val, currentPrice));
  };

  useEffect(() => {
    const rawJwt = localStorage.getItem("jwt");
    const jwt = rawJwt?.startsWith("{") ? JSON.parse(rawJwt)?.jwt : rawJwt;

    if (jwt) {
      dispatch(getUserWallet(jwt));
      if (coinDetails?.id) {
        dispatch(getAssetDetails({ coinId: coinDetails.id, jwt }));
      }
    }
  }, [dispatch, coinDetails?.id]);

  const handleExecuteOrder = async () => {
    if (!amount || Number(amount) <= 0 || parseFloat(quantity) <= 0) return;

    const rawJwt = localStorage.getItem("jwt");
    const jwt = rawJwt?.startsWith("{") ? JSON.parse(rawJwt)?.jwt : rawJwt;

    setIsSubmitting(true);

    const success = await dispatch(
      payOrder({
        jwt,
        orderData: {
          coinId: coinDetails?.id,
          quantity: parseFloat(quantity),
          orderType,
        },
      })
    );

    setIsSubmitting(false);

    if (success) {
      navigate("/portfolio");
    }
  };

  const availableCash = userWallet?.balance ?? 0;
  const availableQuantity = assetDetails?.quantity ?? 0;

  const isInsufficientBuy =
    orderType === "BUY" && Number(amount) > Number(availableCash);
  const isInsufficientSell =
    orderType === "SELL" && parseFloat(quantity) > parseFloat(availableQuantity);

  return (
    <div className="space-y-6 p-5 text-slate-100">
      <div>
        <div className="flex gap-4 items-center justify-between">
          <Input
            className="py-6 bg-slate-900 border-slate-800 text-white font-medium focus-visible:ring-cyan-500"
            placeholder="Enter Amount ($)..."
            onChange={handleChange}
            value={amount}
            type="number"
            min="0"
            step="any"
            name="amount"
          />
          <div>
            <p className="border border-slate-800 bg-slate-900 text-lg font-mono flex justify-center items-center w-36 h-12 rounded-xl text-cyan-400">
              {quantity}
            </p>
          </div>
        </div>

        {isInsufficientBuy && (
          <p className="text-rose-500 text-xs text-center pt-2 font-medium">
            Insufficient Wallet balance to execute buy order
          </p>
        )}
        {isInsufficientSell && (
          <p className="text-rose-500 text-xs text-center pt-2 font-medium">
            Insufficient Coin holdings to execute sell order
          </p>
        )}
      </div>

      {/* Dynamic Coin Header Details with AvatarFallback */}
      <div className="flex gap-4 items-center p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <Avatar className="h-10 w-10 border border-slate-700 bg-slate-800 flex items-center justify-center shrink-0">
          <AvatarImage
            src={coinImage}
            alt={coinDetails?.name || "Coin"}
            className="object-contain p-0.5"
          />
          <AvatarFallback className="bg-slate-800 text-xs font-bold text-cyan-400">
            {coinDetails?.symbol?.slice(0, 3)?.toUpperCase() || "CRY"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-semibold text-white uppercase">
              {coinDetails?.symbol || "BTC"}
            </p>
            <DotIcon className="text-slate-500" />
            <p className="text-xs text-slate-400 truncate">
              {coinDetails?.name || "Bitcoin"}
            </p>
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <p className="text-base font-bold text-white font-mono">
              ${Number(currentPrice).toLocaleString()}
            </p>
            <p
              className={`text-xs font-semibold ${
                isPositive ? "text-emerald-400" : "text-rose-500"
              }`}
            >
              <span>
                {isPositive
                  ? `+$${Number(priceChangeAmount).toFixed(2)}`
                  : `-$${Math.abs(Number(priceChangeAmount)).toFixed(2)}`}
              </span>
              <span className="ml-1">
                ({isPositive ? "+" : ""}
                {Number(priceChangePercentage).toFixed(2)}%)
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
        <span>Order Type</span>
        <span className="font-medium text-slate-200">Market Order</span>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
        <span>
          {orderType === "BUY" ? "Available Cash" : "Available Holdings"}
        </span>
        <span className="font-mono font-medium text-slate-200">
          {orderType === "BUY"
            ? `$${Number(availableCash).toFixed(2)}`
            : `${availableQuantity} ${coinDetails?.symbol?.toUpperCase() || ""}`}
        </span>
      </div>

      <div>
        <Button
          onClick={handleExecuteOrder}
          disabled={
            !amount ||
            Number(amount) <= 0 ||
            parseFloat(quantity) <= 0 ||
            isInsufficientBuy ||
            isInsufficientSell ||
            isSubmitting
          }
          className={`w-full py-6 font-semibold rounded-xl transition-all shadow-md ${
            orderType === "SELL"
              ? "bg-rose-600 hover:bg-rose-500 text-white"
              : "bg-emerald-600 hover:bg-emerald-500 text-white"
          } disabled:opacity-50`}
        >
          {isSubmitting
            ? "Processing..."
            : `${orderType} ${coinDetails?.symbol?.toUpperCase() || ""}`}
        </Button>

        <Button
          variant="link"
          className="w-full mt-2 text-sm text-cyan-400 hover:text-cyan-300"
          onClick={() => {
            setOrderType(orderType === "BUY" ? "SELL" : "BUY");
            setAmount("");
            setQuantity("0");
          }}
        >
          Switch to {orderType === "BUY" ? "SELL" : "BUY"}
        </Button>
      </div>
    </div>
  );
};

export default TradingForm;