import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

const AssetTable = ({ coin = [], activeCoinId, onSelectCoin }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto max-h-[calc(100vh-8.5rem)] overflow-y-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-slate-950 z-10">
          <TableRow className="border-slate-800 hover:bg-transparent">
            <TableHead className="w-[150px] text-slate-400 text-xs">
              COIN
            </TableHead>
            <TableHead className="text-slate-400 text-xs">SYMBOL</TableHead>
            <TableHead className="text-slate-400 text-xs">VOLUME</TableHead>
            <TableHead className="text-slate-400 text-xs">MARKET CAP</TableHead>
            <TableHead className="text-slate-400 text-xs">24h</TableHead>
            <TableHead className="text-right text-slate-400 text-xs">
              PRICE
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coin?.map((item) => {
            // Support both snake_case and camelCase from backend
            const currentPrice = item.current_price ?? item.currentPrice ?? 0;
            const totalVolume = item.total_volume ?? item.totalVolume ?? 0;
            const marketCap = item.market_cap ?? item.marketCap ?? 0;
            const changePercent =
              item.price_change_percentage_24h ??
              item.priceChangePercentage24h ??
              0;

            const isPositive = Number(changePercent) >= 0;
            const isSelected = item.id === activeCoinId;

            return (
              <TableRow
                key={item.id}
                onClick={() => onSelectCoin?.(item)}
                className={`cursor-pointer transition-colors border-slate-800/60 ${
                  isSelected
                    ? "bg-slate-800/90 hover:bg-slate-800"
                    : "hover:bg-slate-900/60"
                }`}
              >
                <TableCell
                  className="font-medium flex items-center gap-2.5 py-3.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/market/${item.id}`);
                  }}
                >
                  <Avatar className="h-7 w-7 border border-slate-800 shrink-0">
                    <AvatarImage src={item.image} alt={item.name} />
                    <AvatarFallback className="text-[10px] bg-slate-800 text-slate-300">
                      {item.symbol?.slice(0, 2)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-slate-200 font-semibold text-xs truncate max-w-[100px] hover:text-cyan-400">
                    {item.name}
                  </span>
                </TableCell>

                <TableCell className="uppercase text-xs text-slate-400 font-medium">
                  {item.symbol}
                </TableCell>

                <TableCell className="text-xs text-slate-300">
                  ${Number(totalVolume).toLocaleString()}
                </TableCell>

                <TableCell className="text-xs text-slate-300">
                  ${Number(marketCap).toLocaleString()}
                </TableCell>

                <TableCell
                  className={`text-xs font-semibold ${
                    isPositive ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {Number(changePercent).toFixed(2)}%
                </TableCell>

                <TableCell className="text-right font-medium text-xs text-slate-100">
                  ${Number(currentPrice).toLocaleString()}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AssetTable;
