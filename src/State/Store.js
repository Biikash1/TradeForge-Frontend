import { combineReducers, applyMiddleware, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./Authentication/Reducer";
import coinReducer from "./Coin/CoinReducer";
import walletReducer from "./Wallet/WalletReducer";
import withdrawalReducer from "./Withdrawal/WithdrawalReducer";

const rootReducer = combineReducers({
   auth:authReducer,
   coin:coinReducer,
   wallet:walletReducer,
   Withdrawal:withdrawalReducer
});

export const store = legacy_createStore(
  rootReducer,
  applyMiddleware(thunk)
)