import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const AccountVerificationForm = () => {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    console.log("Submitted OTP:", value);
  };

  return (
    <div className="w-full max-w-lg p-6">
      <div className="space-y-6">
        {/* Email & Send OTP Row */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-secondary/30 border border-border">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase font-medium">
              Email Address
            </p>
            <p className="text-sm font-semibold text-foreground">
              anuragmondal@gmail.com
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                Send OTP
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center text-lg font-bold">
                  Enter Verification Code
                </DialogTitle>
              </DialogHeader>

              <div className="py-6 flex flex-col items-center justify-center space-y-6">
                <p className="text-xs text-muted-foreground text-center">
                  Enter the 6-digit code sent to your email.
                </p>

                <InputOTP
                  value={value}
                  onChange={(val) => setValue(val)}
                  maxLength={6}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>

                <DialogClose asChild>
                  <Button
                    onClick={handleSubmit}
                    disabled={value.length !== 6}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5"
                  >
                    Submit OTP
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AccountVerificationForm;
