import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AccountVerificationForm from "./AccountVerificationForm";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((store) => store.auth || {});

  const isTwoFactorEnabled = user?.twoFactorAuth?.enabled ?? false;

  const handleEnableTwoStepVerification = () => {
    console.log("Two Step Verification initiated");
  };

  return (
    <div className="flex flex-col items-center mb-5 px-4">
      <div className="pt-10 w-full lg:w-[60%] space-y-6">
        {/* User Information Card */}
        <Card className="border-slate-800 bg-slate-950/60 text-slate-100">
          <CardHeader className="pb-6 border-b border-slate-800">
            <CardTitle className="text-lg font-semibold text-white">
              Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-sm">
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="w-36 text-slate-400">Email:</span>
                  <span className="font-medium text-slate-200 truncate">
                    {user?.email || "N/A"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-36 text-slate-400">Full Name:</span>
                  <span className="font-medium text-slate-200">
                    {user?.fullName || "N/A"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-36 text-slate-400">Date of Birth:</span>
                  <span className="font-medium text-slate-200">
                    {user?.dob || "01/01/2002"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-36 text-slate-400">Nationality:</span>
                  <span className="font-medium text-slate-200">Indian</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="w-36 text-slate-400">Address:</span>
                  <span className="font-medium text-slate-200">
                    {user?.address || "City Center, Durgapur"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-36 text-slate-400">City:</span>
                  <span className="font-medium text-slate-200">
                    {user?.city || "Kolkata"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-36 text-slate-400">Pin Code:</span>
                  <span className="font-medium text-slate-200">
                    {user?.pinCode || "713246"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-36 text-slate-400">Country:</span>
                  <span className="font-medium text-slate-200">India</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2-Step Verification Card */}
        <Card className="border-slate-800 bg-slate-950/60 text-slate-100">
          <CardHeader className="pb-6 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-white">
                2-Step Verification
              </CardTitle>
              {isTwoFactorEnabled ? (
                <Badge className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 px-3 py-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Enabled</span>
                </Badge>
              ) : (
                <Badge className="bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 px-3 py-1">
                  <XCircle className="h-3.5 w-3.5" />
                  <span>Disabled</span>
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  disabled={isTwoFactorEnabled}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium"
                >
                  {isTwoFactorEnabled
                    ? "2-Step Verification Active"
                    : "Enable 2-Step Verification"}
                </Button>
              </DialogTrigger>
              <DialogContent className="border-slate-800 bg-slate-900 text-slate-100 sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    Verify your account
                  </DialogTitle>
                </DialogHeader>
                <AccountVerificationForm
                  handleSubmit={handleEnableTwoStepVerification}
                />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
