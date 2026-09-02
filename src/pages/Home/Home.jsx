import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import AssetTable from "./AssetTable";
import StockChart from "./StockChart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DotIcon,
  MessageCircle,
  X,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { getCoinList } from "@/State/Coin/ActionCoin";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [category, setCategory] = useState("all");
  const [inputValue, setInputValue] = useState("");
  const [isBotRelease, setIsBotRelease] = useState(false);
  const [activeCoin, setActiveCoin] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { coinList } = useSelector((store) => store.coin || {});

  const handleBotRelease = () => setIsBotRelease((prev) => !prev);
  const handleCategory = (value) => setCategory(value);
  const handleChange = (e) => setInputValue(e.target.value);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && inputValue.trim()) {
      setInputValue("");
    }
  };

  useEffect(() => {
    dispatch(getCoinList(1));
  }, [dispatch]);

  // Safe field accessors
  const getChangePercent = (item) =>
    Number(
      item?.price_change_percentage_24h ?? item?.priceChangePercentage24h ?? 0,
    );

  const getPrice = (item) =>
    Number(item?.current_price ?? item?.currentPrice ?? 0);

  const getPriceChange = (item) =>
    Number(item?.price_change_24h ?? item?.priceChange24h ?? 0);

  // Dynamic filter for tabs
  const filteredCoins = useMemo(() => {
    if (!coinList || !Array.isArray(coinList)) return [];

    const listCopy = [...coinList];
    switch (category) {
      case "top50":
        return listCopy.slice(0, 50);
      case "topGainers":
        return listCopy.sort(
          (a, b) => getChangePercent(b) - getChangePercent(a),
        );
      case "topLosers":
        return listCopy.sort(
          (a, b) => getChangePercent(a) - getChangePercent(b),
        );
      case "all":
      default:
        return listCopy;
    }
  }, [coinList, category]);

  // Keep active coin synchronized
  useEffect(() => {
    if (filteredCoins.length > 0) {
      const exists = filteredCoins.some((c) => c.id === activeCoin?.id);
      if (!activeCoin || !exists) {
        setActiveCoin(filteredCoins[0]);
      }
    }
  }, [filteredCoins, activeCoin]);

  const activePercentChange = getChangePercent(activeCoin);
  const isPositive = activePercentChange >= 0;
  const currentPrice = getPrice(activeCoin);

  // Derive 24h High/Low indicators
  const high24h = Number(activeCoin?.high_24h ?? currentPrice * 1.025);
  const low24h = Number(activeCoin?.low_24h ?? currentPrice * 0.975);
  const rangeProgress =
    high24h !== low24h
      ? Math.min(
          Math.max(((currentPrice - low24h) / (high24h - low24h)) * 100, 0),
          100,
        )
      : 50;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 flex flex-col">
      <div className="lg:flex flex-1 overflow-hidden">
        {/* Left Section: Filters & Scrollable Table */}
        <div className="lg:w-1/2 lg:border-r border-slate-800/80 flex flex-col h-[calc(100vh-4rem)]">
          <div className="p-3 flex items-center gap-2 border-b border-slate-800/80 shrink-0 bg-slate-950">
            {[
              { id: "all", label: "All" },
              { id: "top50", label: "Top 50" },
              { id: "topGainers", label: "Top Gainers" },
              { id: "topLosers", label: "Top Losers" },
            ].map((cat) => (
              <Button
                key={cat.id}
                onClick={() => handleCategory(cat.id)}
                variant={category === cat.id ? "default" : "outline"}
                className={`rounded-full text-xs font-semibold h-8 px-4 transition-all ${
                  category === cat.id
                    ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-sm"
                    : "border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
                size="sm"
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Table Container with hidden system scrollbar */}
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-track]:bg-transparent">
            <AssetTable
              coin={filteredCoins}
              activeCoinId={activeCoin?.id}
              onSelectCoin={(selected) => setActiveCoin(selected)}
            />
          </div>
        </div>

        {/* Right Section: Chart + Rich Analytics Section */}
        <div className="hidden lg:flex lg:w-1/2 p-5 flex-col gap-4 h-[calc(100vh-4rem)] overflow-y-auto bg-slate-950 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-800">
          {/* Main Chart Box */}
          <div className="border border-slate-800/80 bg-slate-900/40 rounded-2xl p-4 shadow-xl shrink-0">
            <StockChart coinId={activeCoin?.id || "bitcoin"} />
          </div>

          {/* Dynamic Asset Details & Analytics Deck */}
          {activeCoin ? (
            <div className="border border-slate-800/80 bg-slate-900/50 rounded-2xl p-5 shadow-lg flex flex-col gap-4 flex-1 justify-between">
              {/* Header Title & Price */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border border-slate-700 bg-slate-800">
                    <AvatarImage src={activeCoin.image} alt={activeCoin.name} />
                    <AvatarFallback className="text-xs font-bold">
                      {activeCoin.symbol?.slice(0, 3)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                        {activeCoin.symbol}
                      </h2>
                      <DotIcon className="text-slate-600" />
                      <span className="text-sm font-medium text-slate-400">
                        {activeCoin.name}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2.5 mt-0.5">
                      <span className="text-2xl font-black text-white">
                        ${currentPrice.toLocaleString()}
                      </span>
                      <span
                        className={`text-xs font-semibold flex items-center ${
                          isPositive ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {isPositive ? (
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowDownRight className="h-3.5 w-3.5" />
                        )}
                        {isPositive ? "+" : ""}$
                        {getPriceChange(activeCoin).toFixed(2)} (
                        {activePercentChange.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => navigate(`/market/${activeCoin.id}`)}
                  className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-semibold h-9 px-4 rounded-xl shadow-md"
                >
                  <span>Trade {activeCoin.symbol?.toUpperCase()}</span>
                  <ExternalLink size={13} />
                </Button>
              </div>

              {/* 24h High/Low Slider Gauge */}
              <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/60">
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                  <span>24h Low: ${low24h.toLocaleString()}</span>
                  <span className="text-slate-500 font-normal">24h Range</span>
                  <span>24h High: ${high24h.toLocaleString()}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${rangeProgress}%` }}
                  />
                </div>
              </div>

              {/* Fast Market Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="bg-slate-950/50 border border-slate-800/70 p-3 rounded-xl">
                  <p className="text-slate-500 text-[11px]">Market Cap</p>
                  <p className="font-bold text-slate-200 mt-1 truncate">
                    ${Number(activeCoin.market_cap ?? 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-950/50 border border-slate-800/70 p-3 rounded-xl">
                  <p className="text-slate-500 text-[11px]">24h Volume</p>
                  <p className="font-bold text-slate-200 mt-1 truncate">
                    ${Number(activeCoin.total_volume ?? 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-950/50 border border-slate-800/70 p-3 rounded-xl">
                  <p className="text-slate-500 text-[11px]">Market Rank</p>
                  <p className="font-bold text-cyan-400 mt-1">
                    #{activeCoin.market_cap_rank || "1"}
                  </p>
                </div>
                <div className="bg-slate-950/50 border border-slate-800/70 p-3 rounded-xl">
                  <p className="text-slate-500 text-[11px]">Sentiment</p>
                  <p className="font-bold text-emerald-400 mt-1 flex items-center gap-1">
                    <Zap size={12} /> Bullish
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-slate-500 text-sm border border-slate-800/80 rounded-2xl">
              Select a coin to view market analytics
            </div>
          )}
        </div>
      </div>

      {/* Floating Chatbot Widget */}
      <section className="fixed bottom-5 right-5 z-40 flex flex-col justify-end items-end gap-2">
        {isBotRelease && (
          <div className="rounded-2xl w-[20rem] md:w-[24rem] h-[65vh] bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex justify-between items-center border-b border-slate-800 px-5 py-3.5 bg-slate-950/60">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="font-semibold text-sm text-white">
                  AI Market Bot
                </p>
              </div>
              <Button
                onClick={handleBotRelease}
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </Button>
            </div>

            <div className="flex-1 flex flex-col overflow-y-auto gap-3 p-4 text-xs">
              <div className="self-start max-w-[85%] bg-slate-800/80 text-slate-200 p-3 rounded-xl border border-slate-700/50">
                <p className="font-semibold text-cyan-400 mb-1">Trading Bot</p>
                <p>
                  Hello! Ask me any questions regarding prices, market volume,
                  or cap trends.
                </p>
              </div>

              <div className="self-end max-w-[85%] bg-cyan-600 text-white p-3 rounded-xl">
                <p>
                  What is the current trend for {activeCoin?.name || "Bitcoin"}?
                </p>
              </div>

              <div className="self-start max-w-[85%] bg-slate-800/80 text-slate-200 p-3 rounded-xl border border-slate-700/50">
                <p>
                  {activeCoin?.name || "Bitcoin"} is trading at $
                  {getPrice(activeCoin).toLocaleString()}, moving{" "}
                  <span
                    className={
                      isPositive ? "text-emerald-400" : "text-rose-400"
                    }
                  >
                    {activePercentChange.toFixed(2)}%
                  </span>{" "}
                  over the last 24 hours.
                </p>
              </div>
            </div>

            <div className="p-3 border-t border-slate-800 bg-slate-950/60">
              <Input
                className="w-full bg-slate-900 border-slate-700 text-xs text-white placeholder:text-slate-500 focus-visible:ring-cyan-500"
                placeholder="Ask about crypto..."
                onChange={handleChange}
                value={inputValue}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        )}

        <Button
          onClick={handleBotRelease}
          className="h-12 px-5 gap-2.5 rounded-full shadow-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium"
        >
          <MessageCircle size={20} />
          <span>AI Assistant</span>
        </Button>
      </section>
    </div>
  );
};

export default Home;
