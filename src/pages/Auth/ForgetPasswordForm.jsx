import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ForgetPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    console.log("Forgot Password Request:", data);
    // Replace with your API call: await authService.sendResetOtp(data.email);
  };

  return (
    <div className="w-full">
      <div className="text-center pb-4 space-y-1">
        <h1 className="text-xl font-bold text-white tracking-tight">
          Forgot Password
        </h1>
        <p className="text-xs text-slate-400">
          Enter your registered email to receive a verification code
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300">
            Email Address
          </label>
          <Input
            type="email"
            className="w-full bg-slate-950/60 border-slate-700 text-white placeholder:text-slate-500 py-5 focus-visible:ring-cyan-500"
            placeholder="name@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-xs text-red-400 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-5 mt-2 transition duration-200 disabled:opacity-50"
        >
          {isSubmitting ? "Sending Code..." : "Send Verification Code"}
        </Button>
      </form>
    </div>
  );
};

export default ForgetPasswordForm;