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

const Wallet = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="pt-10 w-full lg:w-[60%]">
        <Card>
          <CardHeader className="pb-9">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-5">
                <WalletIcon size={30} />
                <div>
                  <CardTitle className="text-2xl">My Wallet</CardTitle>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-200 text-sm">#A475Ed</p>
                    <CopyIcon
                      size={15}
                      className="cursor-pointer hover:text-slate-300"
                    />
                  </div>
                </div>
              </div>
              <div>
                <ReloadIcon
                  className="w-6 h-6 cursor-pointer 
                hover:text-gray-400"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign />
              <span className="text-2xl font-semibold">20000</span>
            </div>
            <div className="flex gap-7 mt-5">
              <Dialog>
                <DialogTrigger asChild>
                  <div
                    className="h-24 w-24 hover:text-gray-400 cursor-pointer
                        flex flex-col items-center justify-center rounded-md 
                        shadow-slate-800 shadow-md"
                  >
                    <UploadIcon />
                    <span className="text-sm mt-2">Add Money</span>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Top Up Your Wallet</DialogTitle>
                  </DialogHeader>
                  <TopupForm />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <div
                    className="h-24 w-24 hover:text-gray-400 cursor-pointer
                        flex flex-col items-center justify-center rounded-md 
                        shadow-slate-800 shadow-md"
                  >
                    <UploadIcon />
                    <span className="text-sm mt-2">Withdrawal</span>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Withdrawal</DialogTitle>
                  </DialogHeader>
                  <WithdrawalForm />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <div
                    className="h-24 w-24 hover:text-gray-400 cursor-pointer
                        flex flex-col items-center justify-center rounded-md 
                        shadow-slate-800 shadow-md"
                  >
                    <ShuffleIcon />
                    <span className="text-sm mt-2">Transfer</span>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl">
                      Transfer to other wallet
                    </DialogTitle>
                  </DialogHeader>
                  <TransferForm />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <div className="py-5 pt-10">
          <div className="flex gap-2 items-center pb-5">
            <h1 className="text-2xl font-bold tracking-tight">History</h1>
            <UpdateIcon className="h-5 w-5 cursor-pointer hover:text-gray-400" />
          </div>

          <div className="space-y-3">
            {[1, 1, 1, 1, 1].map((item, i) => (
              <div key={i}>
                <Card className="w-full flex flex-row items-center justify-between px-6 py-4 bg-[#090d16]/60 border-gray-800">
                  {/* Left Side: Shuffle Icon + Title & Date */}
                  <div className="flex flex-row items-center gap-4 text-left">
                    <Avatar className="h-10 w-10 bg-[#141b2d] border border-gray-800/80 flex items-center justify-center shrink-0">
                      <AvatarFallback className="bg-transparent text-white">
                        <ShuffleIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col text-left">
                      <h1 className="text-sm font-medium text-white">
                        Buy Asset
                      </h1>
                      <p className="text-xs text-gray-500">2024-06-02</p>
                    </div>
                  </div>

                  {/* Right Side: Amount */}
                  <div className="shrink-0">
                    <p className="text-sm font-semibold text-emerald-500">
                      999 USD
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
