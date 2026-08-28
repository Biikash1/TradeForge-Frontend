import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PaymentDetailsForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      accountHolderName: "",
      ifsc: "",
      accountNumber: "",
      confirmAccountNumber: "",
      bankName: "",
    },
  });

  const accountNumber = watch("accountNumber");

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
  };

  return (
    <div className="px-10 py-2">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Account Holder Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-200">
            Account Holder Name
          </label>
          <Input
            className="border w-full border-gray-700 p-5"
            placeholder="Ayush Mondal"
            {...register("accountHolderName", {
              required: "Account holder name is required",
            })}
          />
          {errors.accountHolderName && (
            <p className="text-sm text-red-500">
              {errors.accountHolderName.message}
            </p>
          )}
        </div>

        {/* IFSC Code */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-200">IFSC Code</label>
          <Input
            className="border w-full border-gray-700 p-5 uppercase"
            placeholder="SBIN0001234"
            {...register("ifsc", { required: "IFSC code is required" })}
          />
          {errors.ifsc && (
            <p className="text-sm text-red-500">{errors.ifsc.message}</p>
          )}
        </div>

        {/* Account Number */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-200">
            Account Number
          </label>
          <Input
            type="password"
            className="border w-full border-gray-700 p-5"
            placeholder="Enter Account Number"
            {...register("accountNumber", {
              required: "Account number is required",
            })}
          />
          {errors.accountNumber && (
            <p className="text-sm text-red-500">
              {errors.accountNumber.message}
            </p>
          )}
        </div>

        {/* Confirm Account Number */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-200">
            Confirm Account Number
          </label>
          <Input
            type="password"
            className="border w-full border-gray-700 p-5"
            placeholder="Re-enter Account Number"
            {...register("confirmAccountNumber", {
              required: "Please confirm your account number",
              validate: (value) =>
                value === accountNumber || "Account numbers do not match",
            })}
          />
          {errors.confirmAccountNumber && (
            <p className="text-sm text-red-500">
              {errors.confirmAccountNumber.message}
            </p>
          )}
        </div>

        {/* Bank Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-200">Bank Name</label>
          <Input
            className="border w-full border-gray-700 p-5"
            placeholder="State Bank of India"
            {...register("bankName", { required: "Bank name is required" })}
          />
          {errors.bankName && (
            <p className="text-sm text-red-500">{errors.bankName.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <DialogClose asChild className="w-full">
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-5"
          >
            Save Details
          </Button>
        </DialogClose>
      </form>
    </div>
  );
};

export default PaymentDetailsForm;
