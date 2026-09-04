import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CopyIcon,
  ReloadIcon,
  ShuffleIcon,
  UpdateIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
import { DollarSign, WalletIcon } from "lucide-react";
import TopupForm from "./TopupForm";
import WithdrawalForm from "./WithdrawalForm";
import TransferForm from "./TransferForm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserWallet,
  getWalletTransactions,
  depositMoney,
} from "@/State/Wallet/ActionWallet";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Wallet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasDeposited = useRef(false);

  const { wallet } = useSelector((store) => store);
  const userWallet = wallet?.userWallet;
  const transactions = wallet?.transactions || [];

  const query = useQuery();

  // Handle all variations of Razorpay and Stripe redirect params
  const orderId =
    query.get("order_id") ||
    query.get("razorpay_payment_link_reference_id") ||
    query.get("orderId");

  const paymentId =
    query.get("razorpay_payment_id") ||
    query.get("payment_id") ||
    query.get("razorpay_payment_link_id");

  const handleFetchUserWallet = () => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) dispatch(getUserWallet(jwt));
  };

  const handleFetchWalletTransaction = () => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) dispatch(getWalletTransactions({ jwt }));
  };

  // Initial load of wallet data
  useEffect(() => {
    handleFetchUserWallet();
    handleFetchWalletTransaction();
  }, [dispatch]);

  // Handle payment gateway return and credit wallet
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");

    console.log("=== GATEWAY CALLBACK CHECK ===", {
      extractedOrderId: orderId,
      extractedPaymentId: paymentId,
      hasJwt: !!jwt,
      alreadyDeposited: hasDeposited.current,
    });

    if (orderId && paymentId && jwt && !hasDeposited.current) {
      hasDeposited.current = true;

      dispatch(
        depositMoney({
          jwt,
          orderId: Number(orderId),
          paymentId,
          navigate,
        })
      );
    }
  }, [orderId, paymentId, dispatch, navigate]);

  const copyWalletId = () => {
    if (userWallet?.id) {
      navigator.clipboard.writeText(userWallet.id.toString());
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-4rem)] p-4 text-slate-100">
      <div className="pt-6 w-full lg:w-[60%] space-y-6">
        <Card className="bg-slate-900/60 border-slate-800 shadow-xl">
          <CardHeader className="pb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
                  <WalletIcon size={26} />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-white">
                    My Wallet
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-slate-400 text-xs">
                      #{userWallet?.id || "------"}
                    </p>
                    <CopyIcon
                      size={14}
                      onClick={copyWalletId}
                      className="cursor-pointer text-slate-400 hover:text-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <ReloadIcon
                  onClick={handleFetchUserWallet}
                  className="w-5 h-5 cursor-pointer text-slate-400 hover:text-white transition-colors"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex items-baseline gap-1">
              <DollarSign className="h-6 w-6 text-slate-400" />
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {Number(userWallet?.balance ?? 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="text-xs font-semibold text-slate-400 ml-1">
                USD
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              {/* Deposit Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="h-20 bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/80 cursor-pointer flex flex-col items-center justify-center rounded-xl transition-all shadow-sm">
                    <UploadIcon className="h-5 w-5 text-cyan-400" />
                    <span className="text-xs font-semibold mt-2 text-slate-200">
                      Add Money
                    </span>
                  </div>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Top Up Your Wallet
                    </DialogTitle>
                  </DialogHeader>
                  <TopupForm />
                </DialogContent>
              </Dialog>

              {/* Withdrawal Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="h-20 bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/80 cursor-pointer flex flex-col items-center justify-center rounded-xl transition-all shadow-sm">
                    <UploadIcon className="h-5 w-5 rotate-180 text-rose-400" />
                    <span className="text-xs font-semibold mt-2 text-slate-200">
                      Withdrawal
                    </span>
                  </div>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Request Withdrawal
                    </DialogTitle>
                  </DialogHeader>
                  <WithdrawalForm availableBalance={userWallet?.balance} />
                </DialogContent>
              </Dialog>

              {/* Transfer Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="h-20 bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/80 cursor-pointer flex flex-col items-center justify-center rounded-xl transition-all shadow-sm">
                    <ShuffleIcon className="h-5 w-5 text-indigo-400" />
                    <span className="text-xs font-semibold mt-2 text-slate-200">
                      Transfer
                    </span>
                  </div>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
                  <DialogHeader>
                    <DialogTitle className="text-center text-lg font-bold text-white">
                      Transfer To Another Wallet
                    </DialogTitle>
                  </DialogHeader>
                  <TransferForm />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History Section */}
        <div className="py-2">
          <div className="flex justify-between items-center pb-4">
            <h1 className="text-lg font-bold text-white tracking-tight">
              Transaction History
            </h1>
            <UpdateIcon
              onClick={handleFetchWalletTransaction}
              className="h-4 w-4 cursor-pointer text-slate-400 hover:text-white transition-colors"
            />
          </div>

          <div className="space-y-2.5">
            {transactions.length > 0 ? (
              transactions.map((item, i) => (
                <Card
                  key={item.id || i}
                  className="w-full flex flex-row items-center justify-between px-5 py-3.5 bg-slate-900/40 border-slate-800 hover:bg-slate-900/60 transition-colors"
                >
                  <div className="flex flex-row items-center gap-3.5 text-left">
                    <Avatar className="h-9 w-9 bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                      <AvatarFallback className="bg-transparent text-slate-300">
                        <ShuffleIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col text-left">
                      <h2 className="text-xs font-semibold text-white">
                        {item.type || item.purpose || "Wallet Activity"}
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        {item.date ? new Date(item.date).toLocaleDateString() : "---"}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <p className="text-xs font-bold text-emerald-400">
                      +{item.amount} USD
                    </p>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No recent transactions found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;