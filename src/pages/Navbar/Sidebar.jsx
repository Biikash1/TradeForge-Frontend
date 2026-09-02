import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { logout } from "@/State/Authentication/Action";
import {
  Home,
  Bookmark,
  Activity,
  Wallet,
  Landmark,
  CreditCard,
  User,
  LogOut,
  PieChart,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const menu = [
  {
    name: "Home",
    path: "/",
    icon: Home,
  },
  {
    name: "Portfolio",
    path: "/portfolio",
    icon: PieChart,
  },
  {
    name: "Watchlist",
    path: "/watchlist",
    icon: Bookmark,
  },
  {
    name: "Activity",
    path: "/activity",
    icon: Activity,
  },
  {
    name: "Wallet",
    path: "/wallet",
    icon: Wallet,
  },
  {
    name: "Payment Details",
    path: "/payment-details",
    icon: Landmark,
  },
  {
    name: "Withdrawal",
    path: "/withdrawal",
    icon: CreditCard,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="flex flex-col justify-between flex-1 h-[calc(100vh-6.5rem)] pt-4 pb-2">
      {/* Expanded Vertical Navigation Stack */}
      <div className="flex-1 flex flex-col justify-between gap-2 w-full my-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <SheetClose asChild key={item.name} className="w-full flex-1">
              <Button
                variant={isActive ? "secondary" : "ghost"}
                onClick={() => handleNavigation(item.path)}
                className={`w-full h-full min-h-[50px] justify-start gap-4 px-4 text-base font-medium transition-all rounded-xl ${
                  isActive
                    ? "bg-slate-800/90 text-cyan-400 border border-cyan-500/30 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-900/80"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{item.name}</span>
              </Button>
            </SheetClose>
          );
        })}
      </div>

      {/* Logout Action at Bottom */}
      <div className="pt-3 border-t border-slate-800 w-full mt-2">
        <SheetClose asChild className="w-full">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full h-12 justify-start gap-4 px-4 text-base font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors rounded-xl"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>Logout</span>
          </Button>
        </SheetClose>
      </div>
    </div>
  );
};

export default Sidebar;
