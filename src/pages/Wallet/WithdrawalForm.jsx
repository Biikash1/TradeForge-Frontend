import { Input } from "@/components/ui/input";
import bankLogo from "@/assets/bankLogo.png";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import {
  withdrawalRequest,
  getPaymentDetails,
} from "@/State/Withdrawal/ActionWithdrawal";
import { CheckCircle2 } from "lucide-react";

const WithdrawalForm = ({ availableBalance = 0 }) => {
  const [amount, setAmount] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const dispatch = useDispatch();

  const rawDetails = useSelector(
    (store) => store.withdrawal?.paymentDetails || store.withdrawal?.PaymentDetails
  );

  const accounts = Array.isArray(rawDetails)
    ? rawDetails
    : rawDetails && rawDetails.accountNumber
    ? [rawDetails]
    : [];

  useEffect(() => {
    const rawJwt = localStorage.getItem("jwt");
    const jwt = rawJwt?.startsWith("{") ? JSON.parse(rawJwt)?.jwt : rawJwt;

    if (jwt) {
      dispatch(getPaymentDetails({ jwt }));
    }
  }, [dispatch]);

  // Automatically select first account if none is picked yet
  useEffect(() => {
    if (accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId]);

  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = () => {
    if (!amount || Number(amount) <= 0 || !selectedAccountId) return;

    const rawJwt = localStorage.getItem("jwt");
    const jwt = rawJwt?.startsWith("{") ? JSON.parse(rawJwt)?.jwt : rawJwt;

    dispatch(
      withdrawalRequest({
        amount: Number(amount),
        bankAccountId: selectedAccountId,
        jwt,
      })
    );
  };

  return (
    <div className="pt-4 space-y-5 text-slate-100">
      {/* Available Balance */}
      <div className="flex justify-between items-center rounded-xl bg-slate-950 border border-slate-800 px-4 py-3">
        <span className="text-xs text-slate-400">Available Balance</span>
        <span className="text-base font-bold text-emerald-400">
          $
          {Number(availableBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>

      {/* Amount Input */}
      <div className="space-y-1.5 text-center">
        <label className="text-xs font-medium text-slate-400">
          Enter Withdrawal Amount
        </label>
        <div className="flex items-center justify-center">
          <Input
            onChange={handleChange}
            value={amount}
            className="bg-transparent border-slate-800 text-2xl font-bold text-center h-12 text-white focus-visible:ring-cyan-500"
            placeholder="$0.00"
            type="number"
            step="0.01"
            min="1"
            max={availableBalance}
          />
        </div>
      </div>

      {/* Choice Filling Bank Account List */}
      <div>
        <p className="pb-2 text-xs font-medium text-slate-400">
          Transfer to ({accounts.length} linked account{accounts.length === 1 ? "" : "s"})
        </p>

        {accounts.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {accounts.map((acc) => {
              const isSelected = selectedAccountId === acc.id;
              const accNum = acc.accountNumber || acc.acountNumber;
              const accHolder = acc.accountHolderName || acc.acountHolderName;

              return (
                <div
                  key={acc.id}
                  onClick={() => setSelectedAccountId(acc.id)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all ${
                    isSelected
                      ? "border-cyan-500 bg-cyan-950/20 shadow-sm"
                      : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      className="h-6 w-6 object-contain shrink-0"
                      src={bankLogo}
                      alt="Bank"
                    />
                    <div className="truncate">
                      <p className="text-xs font-semibold text-white truncate">
                        {acc.bankName || "Bank Account"}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        •••• {String(accNum || "0000").slice(-4)} • {accHolder}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0 ml-2" />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-3 border border-dashed border-slate-800 rounded-xl text-center">
            <p className="text-xs text-rose-400">
              No bank accounts linked yet. Add one in Payment Details.
            </p>
          </div>
        )}
      </div>

      <DialogClose asChild className="w-full pt-2">
        <Button
          onClick={handleSubmit}
          disabled={
            !amount ||
            Number(amount) <= 0 ||
            Number(amount) > Number(availableBalance) ||
            !selectedAccountId ||
            accounts.length === 0
          }
          className="w-full h-11 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl disabled:opacity-50"
        >
          Request Withdrawal
        </Button>
      </DialogClose>
    </div>
  );
};

export default WithdrawalForm;