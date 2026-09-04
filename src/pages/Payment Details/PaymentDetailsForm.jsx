import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import {
  addPaymentDetails,
  getPaymentDetails,
} from "@/State/Withdrawal/ActionWithdrawal";

const PaymentDetailsForm = ({ initialData, onSuccess }) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      accountHolderName: initialData?.accountHolderName || "",
      ifsc: initialData?.ifsc || "",
      accountNumber: initialData?.accountNumber || "",
      confirmAccountNumber: initialData?.accountNumber || "",
      bankName: initialData?.bankName || "",
    },
  });

  const accountNumber = watch("accountNumber");

  const onSubmit = async (data) => {
    const jwt = localStorage.getItem("jwt");

    const payload = {
      accountHolderName: data.accountHolderName.trim(),
      ifsc: data.ifsc.trim().toUpperCase(),
      accountNumber: data.accountNumber.trim(),
      bankName: data.bankName.trim(),
    };

    const isSaved = await dispatch(
      addPaymentDetails({
        paymentDetails: payload,
        jwt,
      })
    );

    if (isSaved) {
      await dispatch(getPaymentDetails({ jwt }));
      if (onSuccess) onSuccess();
    }
  };

  return (
    <div className="pt-2">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Account Holder Name */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">
            Account Holder Name
          </label>
          <Input
            className="bg-slate-950 border-slate-800 text-sm text-white focus-visible:ring-cyan-500 h-10"
            placeholder="John Doe"
            {...register("accountHolderName", {
              required: "Account holder name is required",
              maxLength: {
                value: 100,
                message: "Name must be under 100 characters",
              },
            })}
          />
          {errors.accountHolderName && (
            <p className="text-xs text-rose-500">
              {errors.accountHolderName.message}
            </p>
          )}
        </div>

        {/* Bank Name */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">
            Bank Name
          </label>
          <Input
            className="bg-slate-950 border-slate-800 text-sm text-white focus-visible:ring-cyan-500 h-10"
            placeholder="State Bank of India"
            {...register("bankName", {
              required: "Bank name is required",
              maxLength: {
                value: 100,
                message: "Bank name must be under 100 characters",
              },
            })}
          />
          {errors.bankName && (
            <p className="text-xs text-rose-500">{errors.bankName.message}</p>
          )}
        </div>

        {/* IFSC Code */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">
            IFSC Code
          </label>
          <Input
            className="bg-slate-950 border-slate-800 text-sm text-white uppercase focus-visible:ring-cyan-500 h-10"
            placeholder="SBIN0001234"
            {...register("ifsc", {
              required: "IFSC code is required",
              pattern: {
                value: /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/,
                message: "Invalid IFSC format (e.g., SBIN0001234)",
              },
            })}
          />
          {errors.ifsc && (
            <p className="text-xs text-rose-500">{errors.ifsc.message}</p>
          )}
        </div>

        {/* Account Number */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">
            Account Number
          </label>
          <Input
            type="password"
            className="bg-slate-950 border-slate-800 text-sm text-white focus-visible:ring-cyan-500 h-10"
            placeholder="Enter Account Number"
            {...register("accountNumber", {
              required: "Account number is required",
              minLength: {
                value: 9,
                message: "Account number must be at least 9 digits",
              },
              maxLength: {
                value: 30,
                message: "Account number cannot exceed 30 digits",
              },
            })}
          />
          {errors.accountNumber && (
            <p className="text-xs text-rose-500">
              {errors.accountNumber.message}
            </p>
          )}
        </div>

        {/* Confirm Account Number */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">
            Confirm Account Number
          </label>
          <Input
            type="password"
            className="bg-slate-950 border-slate-800 text-sm text-white focus-visible:ring-cyan-500 h-10"
            placeholder="Re-enter Account Number"
            {...register("confirmAccountNumber", {
              required: "Please confirm your account number",
              validate: (value) =>
                value === accountNumber || "Account numbers do not match",
            })}
          />
          {errors.confirmAccountNumber && (
            <p className="text-xs text-rose-500">
              {errors.confirmAccountNumber.message}
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-colors"
          >
            {isSubmitting ? "Saving..." : "Save Details"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentDetailsForm;