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

const WithdrawalForm = ({ availableBalance = 0 }) => {
  const [amount, setAmount] = useState("");
  const dispatch = useDispatch();

  // Targeted selector avoiding root state rerender warnings
  const paymentDetails = useSelector(
    (store) => store.withdrawal?.paymentDetails
  );

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt && !paymentDetails) {
      dispatch(getPaymentDetails({ jwt }));
    }
  }, [dispatch, paymentDetails]);

  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = () => {
    if (!amount || Number(amount) <= 0) return;

    dispatch(
      withdrawalRequest({
        amount: Number(amount),
        jwt: localStorage.getItem("jwt"),
      })
    );
  };

  const maskedAccount = paymentDetails?.accountNumber
    ? `•••• ${String(paymentDetails.accountNumber).slice(-4)}`
    : "No linked bank account";

  return (
    <div className="pt-4 space-y-5 text-slate-100">
      {/* Live Available Balance from Wallet Props */}
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

      <div>
        <p className="pb-1.5 text-xs font-medium text-slate-400">Transfer to</p>
        <div className="flex items-center gap-3.5 border border-slate-800 bg-slate-950/60 p-3 rounded-xl">
          <img className="h-7 w-7 object-contain" src={bankLogo} alt="Bank" />
          <div className="truncate">
            <p className="text-sm font-semibold text-white truncate">
              {paymentDetails?.bankName || "Linked Bank Account"}
            </p>
            <p className="text-xs text-slate-500 font-mono">{maskedAccount}</p>
          </div>
        </div>
      </div>

      <DialogClose asChild className="w-full pt-2">
        <Button
          onClick={handleSubmit}
          disabled={
            !amount ||
            Number(amount) <= 0 ||
            Number(amount) > Number(availableBalance) ||
            !paymentDetails
          }
          className="w-full h-11 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl"
        >
          Request Withdrawal
        </Button>
      </DialogClose>
    </div>
  );
};

export default WithdrawalForm;