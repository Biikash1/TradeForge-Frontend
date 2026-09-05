import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrderForUser } from "@/State/Order/ActionOrder";
import calculateProfit from "@/utils/calculateProfit";

const getCleanJwt = () => {
  const token = localStorage.getItem("jwt");
  if (!token) return null;
  try {
    const parsed = JSON.parse(token);
    return parsed.jwt || parsed.token || token;
  } catch (e) {
    return token;
  }
};

const formatDate = (timestamp) => {
  if (!timestamp) return { date: "-", time: "-" };
  const d = new Date(timestamp);
  return {
    date: d.toISOString().split("T")[0].replace(/-/g, "/"),
    time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
  };
};

const Activity = () => {
  const dispatch = useDispatch();
  const orders = useSelector((store) => store.order?.orders || []);

  useEffect(() => {
    const jwt = getCleanJwt();
    if (jwt) {
      dispatch(getAllOrderForUser({ jwt }));
    }
  }, [dispatch]);

  return (
    <div className="p-5 lg:p-20 text-slate-100 max-w-7xl mx-auto">
      <h1 className="font-bold text-3xl pb-5 tracking-tight text-white">Activity</h1>

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-xl">
        <Table>
          <TableHeader className="bg-slate-900/80 border-b border-slate-800">
            <TableRow>
              <TableHead className="py-4 text-slate-400">DATE & TIME</TableHead>
              <TableHead className="text-slate-400">TRADING PAIR</TableHead>
              <TableHead className="text-slate-400">BUY PRICE</TableHead>
              <TableHead className="text-slate-400">SELLING PRICE</TableHead>
              <TableHead className="text-slate-400">ORDER TYPE</TableHead>
              <TableHead className="text-slate-400">PROFIT/LOSS</TableHead>
              <TableHead className="text-right text-slate-400">VALUE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders && orders.length > 0 ? (
              orders.map((item, index) => {
                const { date, time } = formatDate(item.timestamp || item.createdAt);
                const profitStr = calculateProfit(item);
                const isProfit = profitStr.startsWith("+");
                const isLoss = profitStr.startsWith("-");

                return (
                  <TableRow
                    key={item.id || index}
                    className="border-b border-slate-800/60 hover:bg-slate-800/40 transition-colors"
                  >
                    <TableCell className="font-mono text-xs">
                      <p className="text-slate-200">{date}</p>
                      <p className="text-slate-500">{time}</p>
                    </TableCell>

                    <TableCell className="font-medium flex items-center gap-3">
                      <Avatar className="h-8 w-8 bg-slate-800 border border-slate-700 shrink-0">
                        <AvatarImage
                          src={item.orderItem?.coin?.image}
                          alt={item.orderItem?.coin?.name}
                        />
                        <AvatarFallback className="text-[10px] bg-slate-800 text-cyan-400 font-bold">
                          {item.orderItem?.coin?.symbol?.slice(0, 3)?.toUpperCase() || "ORD"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-white">{item.orderItem?.coin?.name || "Crypto"}</p>
                        <p className="text-xs text-slate-400 uppercase font-mono">{item.orderItem?.coin?.symbol}</p>
                      </div>
                    </TableCell>

                    <TableCell className="font-mono text-slate-200">
                      {item.orderItem?.buyPrice ? `$${Number(item.orderItem.buyPrice).toLocaleString()}` : "-"}
                    </TableCell>

                    <TableCell className="font-mono text-slate-200">
                      {item.orderItem?.sellPrice ? `$${Number(item.orderItem.sellPrice).toLocaleString()}` : "-"}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-md ${
                          item.orderType === "BUY"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {item.orderType}
                      </span>
                    </TableCell>

                    <TableCell
                      className={`font-mono font-medium ${
                        isProfit ? "text-emerald-400" : isLoss ? "text-rose-500" : "text-slate-400"
                      }`}
                    >
                      {profitStr}
                    </TableCell>

                    <TableCell className="text-right font-mono font-bold text-slate-100">
                      ${Number(item.price || 0).toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                  No order activity recorded yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Activity;