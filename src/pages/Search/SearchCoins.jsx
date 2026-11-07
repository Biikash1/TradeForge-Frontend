import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchCoin } from "@/State/Coin/ActionCoin";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const SearchCoins = () => {
  const [keyword, setKeyword] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { searchCoinList, loading } = useSelector((store) => store.coin || {});

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      setHasSearched(true);
      dispatch(searchCoin(keyword));
    }
  };

  return (
    <div className="p-5 lg:p-20 text-slate-100 max-w-4xl mx-auto min-h-[calc(100vh-4rem)]">
      <h1 className="font-bold text-3xl pb-2 tracking-tight text-white">Search Markets</h1>
      <p className="text-sm text-slate-400 mb-8">
        Find and trade thousands of digital assets.
      </p>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by coin name or symbol (e.g., Bitcoin, BTC)..."
            className="pl-11 h-12 bg-slate-900/60 border-slate-800 text-white focus-visible:ring-cyan-500 rounded-xl w-full text-base"
          />
        </div>
        <Button
          type="submit"
          disabled={loading || !keyword.trim()}
          className="h-12 px-6 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl shadow-md transition-colors w-28"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Search"}
        </Button>
      </form>

      {/* Results Area */}
      <div className="space-y-3">
        {searchCoinList && searchCoinList.length > 0 ? (
          searchCoinList.map((coin) => (
            <div
              key={coin.id}
              onClick={() => navigate(`/market/${coin.id}`)}
              className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:bg-slate-800/80 cursor-pointer transition-all shadow-sm"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-11 w-11 border border-slate-700 bg-slate-800 shrink-0">
                  {/* CoinGecko search endpoint returns 'large' and 'thumb' for images */}
                  <AvatarImage src={coin.large || coin.thumb} alt={coin.name} />
                  <AvatarFallback className="bg-slate-800 text-cyan-400 text-xs font-bold">
                    {coin.symbol?.slice(0, 3).toUpperCase() || "CO"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-white text-base">{coin.name}</h3>
                  <p className="text-xs text-slate-400 font-mono uppercase mt-0.5">{coin.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Market Rank</p>
                <p className="font-bold text-cyan-400 mt-0.5">
                  {coin.market_cap_rank ? `#${coin.market_cap_rank}` : "Unranked"}
                </p>
              </div>
            </div>
          ))
        ) : (
          !loading && hasSearched && (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
              <div className="h-12 w-12 rounded-full bg-slate-800/80 flex items-center justify-center mb-3">
                <Search className="h-6 w-6 text-slate-500" />
              </div>
              <p className="text-slate-300 font-medium text-lg">No coins found</p>
              <p className="text-sm text-slate-500 mt-1">
                We couldn't find any matches for "{keyword}". Try a different spelling or symbol.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SearchCoins;