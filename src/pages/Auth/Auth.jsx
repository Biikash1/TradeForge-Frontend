import "./Auth.css";
import loginPage from "@/assets/loginPage.png";
import SignupForm from "./SignupForm";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import ForgetPasswordForm from "./ForgetPasswordForm";
import SigninForm from "./SigninForm";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className="authContainer relative min-h-screen w-full"
      style={{ backgroundImage: `url(${loginPage})` }}
    >
      {/* Dark overlay backdrop */}
      <div className="absolute inset-0 bg-[#030712]/75 flex items-center justify-center px-4 py-8">
        {/* Glassmorphic Login Card */}
        <div className="flex flex-col justify-center items-center w-full max-w-[28rem] min-h-[34rem] p-8 rounded-2xl z-10 bg-slate-900/70 backdrop-blur-md border border-slate-700/50 shadow-2xl shadow-black/80">
          <h1 className="text-3xl font-extrabold text-white tracking-tight pb-6 text-center">
            Crypto Trading
          </h1>

          {location.pathname === "/signup" ? (
            <section className="w-full space-y-4">
              <SignupForm />
              <div className="flex items-center justify-center text-sm text-slate-400">
                <span>Already have an account?</span>
                <Button 
                  onClick={() => navigate("/signin")} 
                  variant="ghost" 
                  className="text-cyan-400 hover:text-cyan-300 font-semibold px-2"
                >
                  Sign in
                </Button>
              </div>
            </section>
          ) : location.pathname === "/forgot-password" ? (
            <section className="w-full space-y-4">
              <ForgetPasswordForm />
              <div className="flex items-center justify-center text-sm text-slate-400">
                <span>Back to login?</span>
                <Button 
                  onClick={() => navigate("/signin")} 
                  variant="ghost" 
                  className="text-cyan-400 hover:text-cyan-300 font-semibold px-2"
                >
                  Sign in
                </Button>
              </div>
            </section>
          ) : (
            <section className="w-full space-y-4">
              <SigninForm />
              <div className="flex items-center justify-center text-sm text-slate-400">
                <span>Don't have an account?</span>
                <Button 
                  onClick={() => navigate("/signup")} 
                  variant="ghost" 
                  className="text-cyan-400 hover:text-cyan-300 font-semibold px-2"
                >
                  Sign up
                </Button>
              </div>

              <div className="pt-2">
                <Button
                  className="w-full border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300"
                  onClick={() => navigate("/forgot-password")}
                  variant="outline"
                >
                  Forgot Password?
                </Button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;