import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getWithdrawalHistory } from "@/State/Withdrawal/ActionWithdrawal";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Withdrawal = () => {
  const dispatch = useDispatch();
  const { withdrawal } = useSelector((store) => store);
  const history = withdrawal?.history || [];

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatch(getWithdrawalHistory({ jwt }));
    }
  }, [dispatch]);

  const formatDate = (dateValue) => {
    if (!dateValue) return "---";
    try {
      return new Date(dateValue).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(dateValue);
    }
  };

  const getStatusBadge = (status) => {
    const upper = status?.toUpperCase();
    if (upper === "SUCCESS" || upper === "FILLED" || upper === "APPROVED") {
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    }
    if (upper === "DECLINED" || upper === "FAILED" || upper === "REJECTED") {
      return "text-rose-400 bg-rose-500/10 border-rose-500/30";
    }
    return "text-amber-400 bg-amber-500/10 border-amber-500/30";
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-5 lg:px-20 text-slate-100 max-w-7xl mx-auto">
      <div className="flex flex-col gap-6 pt-4">
        <div>
          <h1 className="font-bold text-3xl text-white tracking-tight">
            Withdrawal History
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track and monitor the settlement status of your withdrawal requests.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-xl">
          <Table>
            <TableHeader className="bg-slate-950">
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="py-4 text-slate-400 font-semibold text-xs">
                  DATE
                </TableHead>
                <TableHead className="text-slate-400 font-semibold text-xs">
                  METHOD
                </TableHead>
                <TableHead className="text-slate-400 font-semibold text-xs">
                  AMOUNT
                </TableHead>
                <TableHead className="text-right text-slate-400 font-semibold text-xs">
                  STATUS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length > 0 ? (
                history.map((item, index) => (
                  <TableRow
                    key={item.id || index}
                    className="border-slate-800/80 hover:bg-slate-900/60"
                  >
                    <TableCell className="text-xs text-slate-300 font-medium">
                      {formatDate(item.date)}
                    </TableCell>
                    <TableCell className="text-xs text-slate-400">
                      Bank Account
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-slate-100">
                      $
                      {Number(item.amount ?? 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(
                          item.status,
                        )}`}
                      >
                        {item.status || "PENDING"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-32 text-center text-slate-500 text-sm"
                  >
                    No withdrawal transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;
