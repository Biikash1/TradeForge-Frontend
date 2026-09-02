import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookmarkFilledIcon,
  BookmarkIcon,
  DotIcon,
} from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TradingForm from "./TradingForm";
import StockChart from "../Home/StockChart";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCoinDetails } from "@/State/Coin/ActionCoin";
import {
  DollarSign,
  BarChart2,
  TrendingUp,
  TrendingDown,
  Layers,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const StockDetails = () => {
  const { coinDetails, loading } = useSelector((store) => store.coin || {});
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isWatchlist, setIsWatchlist] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(
        fetchCoinDetails({
          coinId: id,
          jwt: localStorage.getItem("jwt"),
        })
      );
    }
  }, [dispatch, id]);

  // Safe property extraction: handles both raw CoinGecko JSON and Spring Boot Coin Entity
  const marketData = coinDetails?.market_data;

  const currentPrice = Number(
    marketData?.current_price?.usd ??
      coinDetails?.current_price ??
      coinDetails?.currentPrice ??
      0
  );

  const priceChange = Number(
    marketData?.price_change_24h ??
      coinDetails?.price_change_24h ??
      coinDetails?.priceChange24h ??
      0
  );

  const priceChangePercentage = Number(
    marketData?.price_change_percentage_24h ??
      coinDetails?.price_change_percentage_24h ??
      coinDetails?.priceChangePercentage24h ??
      0
  );

  const isPositive = priceChangePercentage >= 0;

  const marketCap = Number(
    marketData?.market_cap?.usd ??
      coinDetails?.market_cap ??
      coinDetails?.marketCap ??
      0
  );

  const totalVolume = Number(
    marketData?.total_volume?.usd ??
      coinDetails?.total_volume ??
      coinDetails?.totalVolume ??
      0
  );

  const high24h = Number(
    marketData?.high_24h?.usd ??
      coinDetails?.high_24h ??
      coinDetails?.high24h ??
      0
  );

  const low24h = Number(
    marketData?.low_24h?.usd ??
      coinDetails?.low_24h ??
      coinDetails?.low24h ??
      0
  );

  const ath = Number(
    marketData?.ath?.usd ?? coinDetails?.ath ?? 0
  );

  const circulatingSupply = Number(
    marketData?.circulating_supply ??
      coinDetails?.circulating_supply ??
      coinDetails?.circulatingSupply ??
      0
  );

  const coinImage =
    coinDetails?.image?.large ||
    (typeof coinDetails?.image === "string" ? coinDetails?.image : "");

  return (
    <div className="p-5 mt-2 max-w-7xl mx-auto text-slate-100 space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-800/60">
        <div className="flex gap-4 items-center">
          <Avatar className="h-12 w-12 border border-slate-800 bg-slate-900">
            <AvatarImage src={coinImage} alt={coinDetails?.name || "Coin Logo"} />
            <AvatarFallback className="bg-slate-800 text-xs">
              {coinDetails?.symbol?.slice(0, 2)?.toUpperCase() || "CO"}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-bold text-white uppercase tracking-wide">
                {coinDetails?.symbol || "---"}
              </p>
              <DotIcon className="text-slate-500" />
              <p className="text-slate-400 text-sm">{coinDetails?.name}</p>
            </div>

            <div className="flex items-baseline gap-2 mt-0.5">
              <p className="text-2xl font-bold text-white">
                ${currentPrice.toLocaleString()}
              </p>
              <div
                className={`text-sm font-semibold flex items-center gap-0.5 ${
                  isPositive ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                <span>
                  {isPositive ? "+" : ""}${priceChange.toFixed(2)} (
                  {isPositive ? "+" : ""}
                  {priceChangePercentage.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsWatchlist(!isWatchlist)}
            className="h-10 w-10 border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white"
          >
            {isWatchlist ? (
              <BookmarkFilledIcon className="h-5 w-5 text-cyan-400" />
            ) : (
              <BookmarkIcon className="h-5 w-5" />
            )}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium shadow-md shadow-cyan-950/40"
              >
                Trade
              </Button>
            </DialogTrigger>
            <DialogContent className="border-slate-800 bg-slate-900 text-slate-100 sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-white">
                  How much do you want to spend?
                </DialogTitle>
              </DialogHeader>
              <TradingForm coin={coinDetails} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 2. Chart Section */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 shadow-xl">
        <StockChart coinId={id} />
      </div>

      {/* 3. Market Overview Grid (Fills Lower Blank Space) */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Market Metrics & Statistics
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl">
            <span className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
              <DollarSign className="h-3.5 w-3.5 text-cyan-400" /> Market Cap
            </span>
            <p className="text-sm md:text-base font-bold text-slate-100 truncate">
              ${marketCap.toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl">
            <span className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
              <BarChart2 className="h-3.5 w-3.5 text-blue-400" /> 24h Volume
            </span>
            <p className="text-sm md:text-base font-bold text-slate-100 truncate">
              ${totalVolume.toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl">
            <span className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> 24h High
            </span>
            <p className="text-sm md:text-base font-bold text-emerald-400 truncate">
              ${high24h.toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl">
            <span className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
              <TrendingDown className="h-3.5 w-3.5 text-rose-400" /> 24h Low
            </span>
            <p className="text-sm md:text-base font-bold text-rose-400 truncate">
              ${low24h.toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl">
            <span className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
              <Layers className="h-3.5 w-3.5 text-indigo-400" /> All-Time High
            </span>
            <p className="text-sm md:text-base font-bold text-slate-100 truncate">
              ${ath ? ath.toLocaleString() : "N/A"}
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl">
            <span className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
              <Activity className="h-3.5 w-3.5 text-amber-400" /> Circulating Supply
            </span>
            <p className="text-sm md:text-base font-bold text-slate-100 truncate">
              {circulatingSupply ? circulatingSupply.toLocaleString() : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetails;