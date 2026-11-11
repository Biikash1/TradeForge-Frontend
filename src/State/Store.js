import { combineReducers, applyMiddleware, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./Authentication/Reducer";
import coinReducer from "./Coin/CoinReducer";
import walletReducer from "./Wallet/WalletReducer";
import withdrawalReducer from "./Withdrawal/WithdrawalReducer";
import orderReducer from "./Order/OrderReducer";
import assetReducer from "./Assets/AssetsReducer";
import watchlistReducer from "./Watchlist/WatchlistReducer";
import portfolioReducer from "./Portfolio/PortfolioReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  coin: coinReducer,
  wallet: walletReducer,
  withdrawal: withdrawalReducer,
  order: orderReducer,
  asset: assetReducer,
  watchlist: watchlistReducer,
  portfolio: portfolioReducer,
});

export const store = legacy_createStore(
  rootReducer,
  applyMiddleware(thunk)
);