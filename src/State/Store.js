import { combineReducers, applyMiddleware, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./Authentication/Reducer";
import coinReducer from "./Coin/CoinReducer";
import walletReducer from "./Wallet/WalletReducer";
import withdrawalReducer from "./Withdrawal/WithdrawalReducer";
import orderReducer from "./Order/OrderReducer";
import assetReducer from "./Assets/AssetsReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  coin: coinReducer,
  wallet: walletReducer,
  withdrawal: withdrawalReducer,
  order: orderReducer,
  asset: assetReducer,
});

export const store = legacy_createStore(
  rootReducer,
  applyMiddleware(thunk)
);