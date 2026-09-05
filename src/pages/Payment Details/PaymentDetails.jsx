import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PaymentDetailsForm from "./PaymentDetailsForm";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPaymentDetails } from "@/State/Withdrawal/ActionWithdrawal";
import { Landmark, ShieldCheck, Plus } from "lucide-react";

const PaymentDetails = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

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

  return (
    <div className="min-h-[calc(100vh-4rem)] p-5 lg:px-20 text-slate-100 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Payment Details
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configured banking profiles used for processing withdrawal settlements.
          </p>
        </div>

        {accounts.length > 0 && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="h-10 px-4 gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs self-start sm:self-auto transition-colors">
                <Plus size={16} />
                <span>Add Another Account</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="border-slate-800 bg-slate-900 text-slate-100 sm:max-w-[460px]">
              <DialogHeader>
                <DialogTitle className="text-white text-lg font-bold">
                  Add Bank Details
                </DialogTitle>
              </DialogHeader>
              <PaymentDetailsForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {accounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {accounts.map((acc, index) => {
            const accNum = acc.accountNumber || acc.acountNumber;
            const accHolder = acc.accountHolderName || acc.acountHolderName;

            return (
              <Card
                key={acc.id || index}
                className="bg-slate-900/60 border-slate-800 shadow-xl overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 p-4">
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <ShieldCheck size={14} /> Active
                  </span>
                </div>

                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
                      <Landmark size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-white truncate max-w-[180px]">
                        {acc.bankName || "Bank Account"}
                      </CardTitle>
                      <CardDescription className="text-slate-400 text-xs mt-0.5 font-mono">
                        A/C: •••• {String(accNum || "0000").slice(-4)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-2 text-sm border-t border-slate-800/80">
                  <div className="flex justify-between py-1 border-b border-slate-800/40">
                    <span className="text-slate-400 text-xs">Account Holder</span>
                    <span className="font-medium text-slate-200 text-xs">
                      {accHolder || "---"}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800/40">
                    <span className="text-slate-400 text-xs">Account Number</span>
                    <span className="font-mono text-slate-200 text-xs">
                      {accNum || "---"}
                    </span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-slate-400 text-xs">IFSC / Code</span>
                    <span className="font-mono text-cyan-400 font-semibold uppercase text-xs">
                      {acc.ifsc || "---"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center max-w-md bg-slate-900/20">
          <div className="mx-auto w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
            <Landmark size={24} />
          </div>
          <h3 className="text-base font-semibold text-white">
            No Payment Details Linked
          </h3>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            Add your beneficiary account details to request balance withdrawals.
          </p>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="h-11 px-6 gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium">
                <Plus size={16} />
                <span>Add Payment Details</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="border-slate-800 bg-slate-900 text-slate-100 sm:max-w-[460px]">
              <DialogHeader>
                <DialogTitle className="text-white text-lg font-bold">
                  Add Bank Details
                </DialogTitle>
              </DialogHeader>
              <PaymentDetailsForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default PaymentDetails;