import { combineReducers, applyMiddleware, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./Authentication/Reducer";
import coinReducer from "./Coin/CoinReducer";

const rootReducer = combineReducers({
   auth:authReducer,
   coin:coinReducer
});

export const store = legacy_createStore(
  rootReducer,
  applyMiddleware(thunk)
)