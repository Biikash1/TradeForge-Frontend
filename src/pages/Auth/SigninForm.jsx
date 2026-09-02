import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { Login } from "@/State/Authentication/Action";
import { useNavigate } from "react-router-dom";

const SigninForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(Login(data));
      navigate("/"); // Navigates only if login succeeds
    } catch (error) {
      console.error("Login failed:", error);
      setError("root", {
        message: error?.message || "Invalid credentials. Please try again.",
      });
    }
  };

  return (
    <div className="w-full">
      <div className="text-center pb-4 space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Welcome Back
        </h2>
        <p className="text-xs text-slate-400">
          Enter your credentials to access your trading desk
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && (
          <div className="p-2.5 rounded bg-red-500/10 border border-red-500/20 text-center">
            <p className="text-xs text-red-400 font-medium">
              {errors.root.message}
            </p>
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-slate-300">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
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

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-300"
          >
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className="w-full bg-slate-950/60 border-slate-700 text-white placeholder:text-slate-500 py-5 pr-10 focus-visible:ring-cyan-500"
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-400 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-5 mt-2 transition duration-200 disabled:opacity-50"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
};

export default SigninForm;
