import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import razorpayImage from "@/assets/razorpayImages.png";
import stripeImages from "@/assets/stripeImage.png";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

const TopupForm = () => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
  };

  const handleSubmit = () => {
    console.log(amount, paymentMethod);
  };

  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  return (
    <div className="pt-6 space-y-6 w-full">
      <div>
        <h1 className="pb-2 text-sm font-medium text-slate-300">
          Enter Amount
        </h1>
        <Input
          onChange={handleChange}
          value={amount}
          className="h-12 text-lg bg-transparent border-slate-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="$9999"
        />
      </div>

      <div>
        <h1 className="pb-3 text-sm font-medium text-slate-300">
          Select Payment Method
        </h1>

        <RadioGroup
          value={paymentMethod}
          onValueChange={handlePaymentMethodChange}
          className="grid grid-cols-2 gap-3 w-full"
        >
          {/* Razorpay Option */}
          <div className="flex items-center space-x-2.5 border border-slate-800 bg-slate-950/40 p-2.5 rounded-lg w-full min-w-0">
            <RadioGroupItem
              icon={DotFilledIcon}
              className="h-6 w-6 shrink-0 border-slate-600 data-[state=checked]:border-white data-[state=checked]:text-white"
              value="RAZORPAY"
              id="r1"
            />
            <Label
              htmlFor="r1"
              className="cursor-pointer flex-1 w-full min-w-0"
            >
              <div className="bg-white rounded-md h-10 w-full flex items-center justify-center px-2 shadow-sm overflow-hidden">
                <img
                  src={razorpayImage}
                  alt="Razorpay"
                  className="h-6 w-auto max-w-[85%] object-contain scale-110"
                />
              </div>
            </Label>
          </div>

          {/* Stripe Option */}
          <div className="flex items-center space-x-2.5 border border-slate-800 bg-slate-950/40 p-2.5 rounded-lg w-full min-w-0">
            <RadioGroupItem
              icon={DotFilledIcon}
              className="h-6 w-6 shrink-0 border-slate-600 data-[state=checked]:border-white data-[state=checked]:text-white"
              value="STRIPE"
              id="r2"
            />
            <Label
              htmlFor="r2"
              className="cursor-pointer flex-1 w-full min-w-0"
            >
              <div className="bg-white rounded-md h-10 w-full flex items-center justify-center px-2 shadow-sm overflow-hidden">
                <img
                  src={stripeImages}
                  alt="Stripe"
                  className="h-6 w-auto max-w-[85%] object-contain scale-110"
                />
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div>
        <Button onClick={handleSubmit} className="w-full py-7">
          Submit
        </Button>
      </div>
    </div>
  );
};

export default TopupForm;
