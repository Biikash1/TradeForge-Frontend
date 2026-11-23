import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navbar from "./pages/Navbar/Navbar";
import Portfolio from "./pages/Portfolio/Portfolio";
import Activity from "./pages/Activity/Activity";
import Wallet from "./pages/Wallet/Wallet";
import Withdrawal from "./pages/Withdrawal/Withdrawal";
import PaymentDetails from "./pages/Payment Details/PaymentDetails";
import StockDetails from "./pages/Stock Details/StockDetails";
import Watchlist from "./pages/Watchlist/Watchlist";
import Profile from "./pages/Profile/Profile";
import NotFound from "./pages/NotFound/NotFound";
import Auth from "./pages/Auth/Auth";
import SearchCoins from "./pages/Search/SearchCoins";
import { toast, Toaster } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { getUser } from "./State/Authentication/Action";
import api, { setAccessToken } from "./config/api";
import {
  connectWebSocket,
  disconnectWebSocket,
  subscribeToChannel,
  unsubscribeFromChannel,
} from "./config/websocket";

function App() {
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const hasBootstrapped = useRef(false);

  // 1. Bootstrap session on page reload via HttpOnly refresh cookie
  useEffect(() => {

    if(hasBootstrapped.current) return;
    hasBootstrapped.current = true;

    const bootstrapAuth = async () => {
      try {
        const { data } = await api.post("/auth/refresh");
        if (data?.jwt) {
          setAccessToken(data.jwt);
          await dispatch(getUser());
        }
      } catch {
        // No valid refresh cookie — user stays on Auth screen
      } finally {
        setIsCheckingAuth(false);
      }
    };

    bootstrapAuth();
  }, [dispatch]);

  // 2. Fetch user profile immediately after fresh login or signup
  useEffect(() => {
    if (auth?.jwt && !auth?.user) {
      dispatch(getUser());
    }
  }, [auth?.jwt, auth?.user, dispatch]);

  // 3. Connect to WebSocket globally
  useEffect(() => {
    connectWebSocket();
    return () => {
      disconnectWebSocket();
    };
  }, []);

  // 4. Subscribe to user-specific trade notifications
  useEffect(() => {
    if (auth.user?.id) {
      const notificationChannel = `/topic/notifications/${auth.user.id}`;

      subscribeToChannel(notificationChannel, (data) => {
        if (data && data.title) {
          toast.success(data.title, {
            description: data.message,
            duration: 6000,
          });
        }
      });

      return () => {
        unsubscribeFromChannel(notificationChannel);
      };
    }
  }, [auth.user?.id]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        Loading TradeForge...
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      {auth.user ? (
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/withdrawal" element={<Withdrawal />} />
            <Route path="/payment-details" element={<PaymentDetails />} />
            <Route path="/market/:id" element={<StockDetails />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<SearchCoins />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </div>
      ) : (
        <Auth />
      )}
    </>
  );
}

export default App;