import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const AccountVerificationForm = ({ handleSubmit }) => {
  const [value, setValue] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic user email from Redux state
  const { user } = useSelector((store) => store.auth || {});

  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      // Dispatch your send OTP action here (e.g., dispatch(sendVerificationOtp()))
      toast.success(`OTP sent to ${user?.email || "your registered email"}`);
      setIsOtpSent(true);
    } catch (error) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async () => {
    if (value.length !== 6) return;

    setIsLoading(true);
    try {
      if (handleSubmit) {
        await handleSubmit(value);
      } else {
        console.log("Submitted OTP:", value);
      }
    } catch (error) {
      toast.error(error.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 pt-2">
      {/* Email & Send OTP Info Box */}
      <div className="flex items-center justify-between gap-4 p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
        <div className="space-y-0.5 min-w-0">
          <p className="text-[11px] text-slate-400 uppercase font-medium">
            Email Address
          </p>
          <p className="text-sm font-semibold text-slate-200 truncate">
            {user?.email || "user@example.com"}
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          disabled={isLoading}
          onClick={handleSendOtp}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium text-xs px-3 shrink-0"
        >
          {isOtpSent ? "Resend OTP" : "Send OTP"}
        </Button>
      </div>

      {/* OTP Input Section */}
      <div className="flex flex-col items-center justify-center space-y-5">
        <p className="text-xs text-slate-400 text-center">
          {isOtpSent
            ? "Enter the 6-digit code sent to your email"
            : "Click 'Send OTP' above to receive your verification code"}
        </p>

        <InputOTP
          value={value}
          onChange={(val) => setValue(val)}
          maxLength={6}
          disabled={!isOtpSent || isLoading}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} className="border-slate-700 text-white" />
            <InputOTPSlot index={1} className="border-slate-700 text-white" />
            <InputOTPSlot index={2} className="border-slate-700 text-white" />
          </InputOTPGroup>
          <InputOTPSeparator className="text-slate-600" />
          <InputOTPGroup>
            <InputOTPSlot index={3} className="border-slate-700 text-white" />
            <InputOTPSlot index={4} className="border-slate-700 text-white" />
            <InputOTPSlot index={5} className="border-slate-700 text-white" />
          </InputOTPGroup>
        </InputOTP>

        <Button
          type="button"
          onClick={onSubmit}
          disabled={value.length !== 6 || isLoading || !isOtpSent}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-5 font-medium transition duration-200 disabled:opacity-50"
        >
          {isLoading ? "Verifying..." : "Submit OTP"}
        </Button>
      </div>
    </div>
  );
};

export default AccountVerificationForm;
