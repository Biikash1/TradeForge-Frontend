import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BookmarkFilledIcon } from "@radix-ui/react-icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addItemToWatchlist, getUserWatchlist } from "@/State/Watchlist/ActionWatchlist";

const Watchlist = () => {
  const dispatch = useDispatch();
  const { items = [] } = useSelector((store) => store.watchlist || {});

  const handleRemoveFromWatchlist = (coinId) => {
    const rawJwt = localStorage.getItem("jwt");
    const jwt = rawJwt?.startsWith("{") ? JSON.parse(rawJwt)?.jwt : rawJwt;

    if (jwt && coinId) {
      dispatch(addItemToWatchlist({ coinId, jwt }));
    }
  };

  useEffect(() => {
    const rawJwt = localStorage.getItem("jwt");
    const jwt = rawJwt?.startsWith("{") ? JSON.parse(rawJwt)?.jwt : rawJwt;

    if (jwt) {
      dispatch(getUserWatchlist(jwt));
    }
  }, [dispatch]);

  return (
    <div className="p-5 lg:p-20 text-slate-100 max-w-7xl mx-auto">
      <h1 className="font-bold text-3xl pb-5 tracking-tight text-white">Watchlist</h1>

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-xl">
        <Table>
          <TableHeader className="bg-slate-900/80 border-b border-slate-800">
            <TableRow>
              <TableHead className="py-4 text-slate-400">COIN</TableHead>
              <TableHead className="text-slate-400">SYMBOL</TableHead>
              <TableHead className="text-slate-400">VOLUME</TableHead>
              <TableHead className="text-slate-400">MARKET CAP</TableHead>
              <TableHead className="text-slate-400">24H CHANGE</TableHead>
              <TableHead className="text-slate-400">PRICE</TableHead>
              <TableHead className="text-right text-rose-500">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items && items.length > 0 ? (
              items.map((item, index) => {
                const currentPrice = Number(item.current_price ?? item.currentPrice ?? 0);
                const priceChange = Number(
                  item.price_change_percentage_24h ?? item.priceChangePercentage24h ?? 0
                );
                const isPositive = priceChange >= 0;

                return (
                  <TableRow
                    key={item.id || index}
                    className="border-b border-slate-800/60 hover:bg-slate-800/40 transition-colors"
                  >
                    <TableCell className="font-medium flex items-center gap-3">
                      <Avatar className="h-8 w-8 bg-slate-800 border border-slate-700">
                        <AvatarImage src={item.image} alt={item.name} />
                        <AvatarFallback className="text-[10px] bg-slate-800 text-cyan-400 font-bold">
                          {item.symbol?.slice(0, 3)?.toUpperCase() || "COIN"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-white">{item.name}</span>
                    </TableCell>
                    <TableCell className="uppercase font-mono text-slate-300">
                      {item.symbol}
                    </TableCell>
                    <TableCell className="text-slate-300 font-mono">
                      ${Number(item.total_volume || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-slate-300 font-mono">
                      ${Number(item.market_cap || 0).toLocaleString()}
                    </TableCell>
                    <TableCell
                      className={`font-medium ${
                        isPositive ? "text-emerald-400" : "text-rose-500"
                      }`}
                    >
                      {isPositive ? `+${priceChange.toFixed(2)}%` : `${priceChange.toFixed(2)}%`}
                    </TableCell>
                    <TableCell className="font-bold text-slate-100 font-mono">
                      ${currentPrice.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        onClick={() => handleRemoveFromWatchlist(item.id)}
                        size="icon"
                        className="h-9 w-9 text-cyan-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Remove from Watchlist"
                      >
                        <BookmarkFilledIcon className="w-5 h-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                  Your watchlist is empty. Add coins to track real-time metrics.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Watchlist;