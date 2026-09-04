import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import razorpayImage from "@/assets/razorpayImages.png";
import stripeImages from "@/assets/stripeImage.png";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { paymentHandler } from "@/State/Wallet/ActionWallet";

const TopupForm = () => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");

  const dispatch = useDispatch();

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    // Fixed: Passing paymentMethod so paymentHandler resolves the route correctly
    dispatch(
      paymentHandler({
        jwt: localStorage.getItem("jwt"),
        amount,
        paymentMethod,
      }),
    );
  };

  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="pt-4 space-y-5 w-full">
      <div>
        <label className="block pb-2 text-xs font-medium text-slate-300">
          Enter Amount (USD)
        </label>
        <Input
          type="number"
          step="any"
          onChange={handleChange}
          value={amount}
          className="h-11 text-base bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-cyan-500"
          placeholder="e.g. 500"
        />
      </div>

      <div>
        <label className="block pb-2 text-xs font-medium text-slate-300">
          Select Payment Gateway
        </label>

        <RadioGroup
          value={paymentMethod}
          onValueChange={handlePaymentMethodChange}
          className="grid grid-cols-2 gap-3 w-full"
        >
          {/* Razorpay Option */}
          <div className="flex items-center space-x-2.5 border border-slate-800 bg-slate-950/40 p-2.5 rounded-xl w-full">
            <RadioGroupItem
              className="h-4 w-4 shrink-0 border-slate-600 text-cyan-500"
              value="RAZORPAY"
              id="r1"
            />
            <Label htmlFor="r1" className="cursor-pointer flex-1 w-full">
              <div className="bg-white rounded-lg h-9 w-full flex items-center justify-center px-2">
                <img
                  src={razorpayImage}
                  alt="Razorpay"
                  className="h-5 w-auto object-contain"
                />
              </div>
            </Label>
          </div>

          {/* Stripe Option */}
          <div className="flex items-center space-x-2.5 border border-slate-800 bg-slate-950/40 p-2.5 rounded-xl w-full">
            <RadioGroupItem
              className="h-4 w-4 shrink-0 border-slate-600 text-cyan-500"
              value="STRIPE"
              id="r2"
            />
            <Label htmlFor="r2" className="cursor-pointer flex-1 w-full">
              <div className="bg-white rounded-lg h-9 w-full flex items-center justify-center px-2">
                <img
                  src={stripeImages}
                  alt="Stripe"
                  className="h-5 w-auto object-contain"
                />
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Button
        type="submit"
        disabled={!amount || Number(amount) <= 0}
        className="w-full h-11 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl"
      >
        Proceed to Checkout
      </Button>
    </form>
  );
};

export default TopupForm;
