import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Authentication/Reducer";
import coinReducer from "./Coin/CoinReducer";
import walletReducer from "./Wallet/WalletReducer";
import withdrawalReducer from "./Withdrawal/WithdrawalReducer";
import orderReducer from "./Order/OrderReducer";
import assetReducer from "./Assets/AssetsReducer";
import watchlistReducer from "./Watchlist/WatchlistReducer";
import portfolioReducer from "./Portfolio/PortfolioReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    coin: coinReducer,
    wallet: walletReducer,
    withdrawal: withdrawalReducer,
    order: orderReducer,
    asset: assetReducer,
    watchlist: watchlistReducer,
    portfolio: portfolioReducer,
  },
});