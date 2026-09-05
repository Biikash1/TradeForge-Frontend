import { useEffect } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { getUserAssets } from "@/State/Assets/ActionAssets";

const Portfolio = () => {
  const dispatch = useDispatch();
  const userAssets = useSelector((store) => store.asset?.userAssets || []);

  useEffect(() => {
    const rawJwt = localStorage.getItem("jwt");
    const jwt = rawJwt?.startsWith("{") ? JSON.parse(rawJwt)?.jwt : rawJwt;
    if (jwt) {
      dispatch(getUserAssets(jwt));
    }
  }, [dispatch]);

  return (
    <div className="p-5 lg:p-20 text-slate-100 max-w-7xl mx-auto">
      <h1 className="font-bold text-3xl pb-5 tracking-tight text-white">Portfolio</h1>
      
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-xl">
        <Table>
          <TableHeader className="bg-slate-900/80 border-b border-slate-800">
            <TableRow>
              <TableHead className="text-slate-400">ASSETS</TableHead>
              <TableHead className="text-slate-400">PRICE</TableHead>
              <TableHead className="text-slate-400">HOLDINGS</TableHead>
              <TableHead className="text-slate-400">24H CHANGE</TableHead>
              <TableHead className="text-slate-400">CHANGE %</TableHead>
              <TableHead className="text-right text-slate-400">TOTAL VOLUME</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userAssets && userAssets.length > 0 ? (
              userAssets.map((item, index) => {
                const currentPrice = item.coin?.current_price ?? item.coin?.market_data?.current_price?.usd ?? item.buyPrice ?? 0;
                const priceChange = item.coin?.price_change_24h ?? 0;
                const percentChange = item.coin?.price_change_percentage_24h ?? 0;
                const isPositive = percentChange >= 0;

                return (
                  <TableRow key={item.id || index} className="border-b border-slate-800/60 hover:bg-slate-800/40 transition-colors">
                    <TableCell className="font-medium flex items-center gap-3">
                      <Avatar className="h-8 w-8 bg-slate-800 border border-slate-700">
                        <AvatarImage src={item.coin?.image} alt={item.coin?.name} />
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-white">{item.coin?.name || "Asset"}</p>
                        <p className="text-xs text-slate-400 uppercase font-mono">{item.coin?.symbol}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-slate-200">
                      ${Number(currentPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    </TableCell>
                    <TableCell className="font-mono text-slate-200">
                      {item.quantity} {item.coin?.symbol?.toUpperCase()}
                    </TableCell>
                    <TableCell className={`font-medium ${isPositive ? "text-emerald-400" : "text-rose-500"}`}>
                      {isPositive ? `+$${priceChange.toFixed(2)}` : `-$${Math.abs(priceChange).toFixed(2)}`}
                    </TableCell>
                    <TableCell className={`font-medium ${isPositive ? "text-emerald-400" : "text-rose-500"}`}>
                      {isPositive ? `+${percentChange.toFixed(2)}%` : `${percentChange.toFixed(2)}%`}
                    </TableCell>
                    <TableCell className="text-right font-mono text-slate-200">
                      ${Number(item.coin?.total_volume || 0).toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-400 text-sm">
                  No assets found in your portfolio.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Portfolio;