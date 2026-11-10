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
import OrderConfirmationModal from "./OrderConfirmationModal";

const TradingForm = () => {
  const [orderType, setOrderType] = useState("BUY");
  const [orderCategory, setOrderCategory] = useState("MARKET"); // MARKET, LIMIT, STOP_LOSS
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [targetPrice, setTargetPrice] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const coinDetails = useSelector((store) => store.coin?.coinDetails);
  const userWallet = useSelector((store) => store.wallet?.userWallet);
  const assetDetails = useSelector((store) => store.asset?.assetDetails);

  const currentPrice =
    coinDetails?.market_data?.current_price?.usd ??
    coinDetails?.current_price ??
    0;

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

  // Uses Target Price for advanced orders, Current Price for market orders
  const activePrice = orderCategory === "MARKET" ? currentPrice : (Number(targetPrice) || 0);

  const calculateVolume = (val, price) => {
    const numericVal = parseFloat(val);
    const numericPrice = parseFloat(price);

    if (!numericVal || isNaN(numericVal) || !numericPrice || isNaN(numericPrice) || numericPrice <= 0) {
      return "0";
    }

    const volume = numericVal / numericPrice;
    return volume >= 1 ? volume.toFixed(4) : volume.toFixed(6);
  };

  const handleAmountChange = (e) => {
    const val = e.target.value;
    setAmount(val);
    setQuantity(calculateVolume(val, activePrice));
  };

  const handleTargetPriceChange = (e) => {
    const val = e.target.value;
    setTargetPrice(val);
    setQuantity(calculateVolume(amount, val));
  };

  // Recalculate if category switches back to MARKET
  useEffect(() => {
    if (orderCategory === "MARKET") {
      setTargetPrice("");
      setQuantity(calculateVolume(amount, currentPrice));
    } else {
      setQuantity(calculateVolume(amount, targetPrice));
    }
  }, [orderCategory, currentPrice]);

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

  const handleReviewOrder = () => {
    if (!amount || Number(amount) <= 0 || parseFloat(quantity) <= 0) return;
    if (orderCategory !== "MARKET" && (!targetPrice || Number(targetPrice) <= 0)) return;
    setIsModalOpen(true);
  };

  const handleExecuteOrder = async () => {
    setIsModalOpen(false);
    const rawJwt = localStorage.getItem("jwt");
    const jwt = rawJwt?.startsWith("{") ? JSON.parse(rawJwt)?.jwt : rawJwt;

    setIsSubmitting(true);

    let finalOrderType = orderType;
    if (orderCategory === "LIMIT") finalOrderType = `LIMIT_${orderType}`;
    if (orderCategory === "STOP_LOSS") finalOrderType = `STOP_LOSS_${orderType}`;

    const success = await dispatch(
      payOrder({
        jwt,
        orderData: {
          coinId: coinDetails?.id,
          quantity: parseFloat(quantity),
          orderType: finalOrderType,
          ...(orderCategory !== "MARKET" && { targetPrice: parseFloat(targetPrice) })
        },
      })
    );

    setIsSubmitting(false);

    if (success) {
      navigate(orderCategory === "MARKET" ? "/portfolio" : "/activity");
    }
  };

  const availableCash = userWallet?.balance ?? 0;
  const availableQuantity = assetDetails?.quantity ?? 0;

  const isInsufficientBuy = orderType === "BUY" && Number(amount) > Number(availableCash);
  const isInsufficientSell = orderType === "SELL" && parseFloat(quantity) > parseFloat(availableQuantity);

  return (
    <div className="space-y-6 p-5 text-slate-100">
      
      {/* Category Toggle (MARKET / LIMIT / STOP) */}
      <div className="flex gap-2 text-xs">
        {["MARKET", "LIMIT", "STOP_LOSS"].map((cat) => (
          <button
            key={cat}
            type="button"
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
              orderCategory === cat ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
            onClick={() => setOrderCategory(cat)}
          >
            {cat.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {/* Conditional Target Price Input */}
        {orderCategory !== "MARKET" && (
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium ml-1">Target Price (USD)</label>
            <Input
              className="py-5 bg-slate-900 border-slate-800 text-white font-medium focus-visible:ring-cyan-500"
              placeholder={`Current Price: $${currentPrice}`}
              onChange={handleTargetPriceChange}
              value={targetPrice}
              type="number"
              min="0"
              step="any"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs text-slate-400 font-medium ml-1">Investment Amount (USD)</label>
          <div className="flex gap-4 items-center justify-between">
            <Input
              className="py-5 bg-slate-900 border-slate-800 text-white font-medium focus-visible:ring-cyan-500"
              placeholder="Enter Amount ($)..."
              onChange={handleAmountChange}
              value={amount}
              type="number"
              min="0"
              step="any"
            />
            <div>
              <p className="border border-slate-800 bg-slate-900 text-sm font-mono flex justify-center items-center w-36 h-10 rounded-xl text-cyan-400 overflow-hidden px-2 truncate">
                {quantity} {coinDetails?.symbol?.toUpperCase()}
              </p>
            </div>
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

      <div className="flex gap-4 items-center p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <Avatar className="h-10 w-10 border border-slate-700 bg-slate-800 flex items-center justify-center shrink-0">
          <AvatarImage src={coinImage} alt={coinDetails?.name || "Coin"} className="object-contain p-0.5" />
          <AvatarFallback className="bg-slate-800 text-xs font-bold text-cyan-400">
            {coinDetails?.symbol?.slice(0, 3)?.toUpperCase() || "CRY"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-semibold text-white uppercase">{coinDetails?.symbol || "BTC"}</p>
            <DotIcon className="text-slate-500" />
            <p className="text-xs text-slate-400 truncate">{coinDetails?.name || "Bitcoin"}</p>
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <p className="text-base font-bold text-white font-mono">
              ${Number(currentPrice).toLocaleString()}
            </p>
            <p className={`text-xs font-semibold ${isPositive ? "text-emerald-400" : "text-rose-500"}`}>
              <span>
                {isPositive ? `+$${Number(priceChangeAmount).toFixed(2)}` : `-$${Math.abs(Number(priceChangeAmount)).toFixed(2)}`}
              </span>
              <span className="ml-1">
                ({isPositive ? "+" : ""}{Number(priceChangePercentage).toFixed(2)}%)
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
        <span>Order Type</span>
        <span className="font-medium text-slate-200">
          {orderCategory.replace("_", " ")} {orderType}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
        <span>{orderType === "BUY" ? "Available Cash" : "Available Holdings"}</span>
        <span className="font-mono font-medium text-slate-200">
          {orderType === "BUY"
            ? `$${Number(availableCash).toFixed(2)}`
            : `${availableQuantity} ${coinDetails?.symbol?.toUpperCase() || ""}`}
        </span>
      </div>

      <div>
        <Button
          onClick={handleReviewOrder}
          disabled={
            !amount ||
            Number(amount) <= 0 ||
            parseFloat(quantity) <= 0 ||
            (orderCategory !== "MARKET" && (!targetPrice || Number(targetPrice) <= 0)) ||
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
          {isSubmitting ? "Processing..." : `Review ${orderCategory.replace("_", " ")} ${orderType}`}
        </Button>

        <Button
          variant="link"
          className="w-full mt-2 text-sm text-cyan-400 hover:text-cyan-300"
          onClick={() => {
            setOrderType(orderType === "BUY" ? "SELL" : "BUY");
            setAmount("");
            setTargetPrice("");
            setQuantity("0");
          }}
        >
          Switch to {orderType === "BUY" ? "SELL" : "BUY"}
        </Button>
      </div>

      <OrderConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleExecuteOrder}
        orderDetails={{
          coinId: coinDetails?.id,
          symbol: coinDetails?.symbol || "",
          quantity: quantity,
          amount: amount,
          targetPrice: targetPrice,
          orderCategory: orderCategory,
          orderType: orderType,
        }}
      />
    </div>
  );
};

export default TradingForm;