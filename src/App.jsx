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
import { Toaster } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./State/Authentication/Action";

function App() {
  const { auth } = useSelector((store) => store);

  const dispatch = useDispatch();

  console.log(" auth ....", auth);

  // Normalize token string
  const token =
    typeof auth?.jwt === "string"
      ? auth.jwt
      : auth?.jwt?.jwt || localStorage.getItem("jwt");

  useEffect(() => {
    if (token) {
      dispatch(getUser(token));
    }
  }, [token, dispatch]);

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
