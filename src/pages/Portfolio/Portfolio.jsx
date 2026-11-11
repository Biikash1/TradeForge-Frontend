import { useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import { getPortfolioAnalytics } from "@/State/Portfolio/ActionPortfolio";
import { TrendingUp, TrendingDown, DollarSign, Activity, Award } from "lucide-react";

const Portfolio = () => {
  const dispatch = useDispatch();
  const userAssets = useSelector((store) => store.asset?.userAssets || []);
  const analytics = useSelector((store) => store.portfolio?.analytics);

  useEffect(() => {
    const rawJwt = localStorage.getItem("jwt");
    const jwt = rawJwt?.startsWith("{") ? JSON.parse(rawJwt)?.jwt : rawJwt;
    if (jwt) {
      dispatch(getUserAssets(jwt));
      dispatch(getPortfolioAnalytics(jwt));
    }
  }, [dispatch]);

  const isOverallProfit = analytics?.netPnL >= 0;

  return (
    <div className="p-5 lg:p-20 text-slate-100 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight text-white">Portfolio</h1>
        <p className="text-sm text-slate-400 mt-1">Track your performance and asset distribution.</p>
      </div>

      {/* Analytics Dashboard Grid */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Current Value */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl shadow-lg">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <DollarSign className="w-4 h-4 text-cyan-400" /> Current Value
            </span>
            <p className="text-2xl font-bold text-white font-mono">
              ${Number(analytics.currentValue).toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Total Invested: ${Number(analytics.totalInvested).toLocaleString()}
            </p>
          </div>

          {/* Net P&L */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl shadow-lg">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Activity className="w-4 h-4 text-indigo-400" /> Net P&L
            </span>
            <div className="flex items-baseline gap-2">
              <p className={`text-2xl font-bold font-mono ${isOverallProfit ? "text-emerald-400" : "text-rose-500"}`}>
                {isOverallProfit ? "+" : ""}${Number(analytics.netPnL).toLocaleString()}
              </p>
              <span className={`text-sm font-semibold flex items-center ${isOverallProfit ? "text-emerald-400" : "text-rose-500"}`}>
                {isOverallProfit ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {isOverallProfit ? "+" : ""}{analytics.netPnLPercentage}%
              </span>
            </div>
          </div>

          {/* Best Performer */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl shadow-lg">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Award className="w-4 h-4 text-amber-400" /> Top Performer
            </span>
            {analytics.bestPerformer ? (
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-slate-700 bg-slate-800 shrink-0">
                  <AvatarImage src={analytics.bestPerformer.image} alt={analytics.bestPerformer.symbol} />
                  <AvatarFallback className="text-[10px] text-amber-400 bg-slate-800">
                    {analytics.bestPerformer.symbol?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-white uppercase">{analytics.bestPerformer.symbol}</p>
                  <p className="text-xs font-semibold text-emerald-400">
                    +{analytics.bestPerformer.gainPercentage}%
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 mt-2">No data</p>
            )}
          </div>

          {/* Worst Performer */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl shadow-lg">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <TrendingDown className="w-4 h-4 text-rose-400" /> Worst Performer
            </span>
            {analytics.worstPerformer ? (
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-slate-700 bg-slate-800 shrink-0">
                  <AvatarImage src={analytics.worstPerformer.image} alt={analytics.worstPerformer.symbol} />
                  <AvatarFallback className="text-[10px] text-rose-400 bg-slate-800">
                    {analytics.worstPerformer.symbol?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-white uppercase">{analytics.worstPerformer.symbol}</p>
                  <p className="text-xs font-semibold text-rose-400">
                    {analytics.worstPerformer.gainPercentage}%
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 mt-2">No data</p>
            )}
          </div>
        </div>
      )}

      {/* Asset Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-xl mt-6">
        <Table>
          <TableHeader className="bg-slate-950 border-b border-slate-800">
            <TableRow>
              <TableHead className="text-slate-400">ASSETS</TableHead>
              <TableHead className="text-slate-400">PRICE</TableHead>
              <TableHead className="text-slate-400">AVG BUY PRICE</TableHead>
              <TableHead className="text-slate-400">HOLDINGS</TableHead>
              <TableHead className="text-slate-400">TOTAL VALUE</TableHead>
              <TableHead className="text-right text-slate-400">UNREALIZED P&L</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userAssets && userAssets.length > 0 ? (
              userAssets.map((item, index) => {
                const currentPrice = item.coin?.current_price ?? item.coin?.market_data?.current_price?.usd ?? item.buyPrice ?? 0;
                const buyPrice = item.buyPrice ?? 0;
                
                const holdingsValue = item.quantity * currentPrice;
                const investedValue = item.quantity * buyPrice;
                const unrealizedPnL = holdingsValue - investedValue;
                const unrealizedPnLPct = buyPrice > 0 ? ((currentPrice - buyPrice) / buyPrice) * 100 : 0;
                
                const isPnLPositive = unrealizedPnL >= 0;

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
                    
                    <TableCell className="font-medium font-mono text-slate-200">
                      ${Number(currentPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    </TableCell>
                    
                    <TableCell className="font-mono text-slate-400">
                      ${Number(buyPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    </TableCell>
                    
                    <TableCell className="font-mono text-slate-200">
                      {item.quantity} {item.coin?.symbol?.toUpperCase()}
                    </TableCell>
                    
                    <TableCell className="font-mono font-semibold text-white">
                      ${Number(holdingsValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className={`font-mono font-semibold ${isPnLPositive ? "text-emerald-400" : "text-rose-500"}`}>
                          {isPnLPositive ? "+" : ""}${Number(unrealizedPnL).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className={`text-[11px] font-semibold ${isPnLPositive ? "text-emerald-400" : "text-rose-500"}`}>
                           {isPnLPositive ? "+" : ""}{unrealizedPnLPct.toFixed(2)}%
                        </span>
                      </div>
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