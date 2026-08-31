import { combineReducers, applyMiddleware, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./Authentication/Reducer";

const rootReducer = combineReducers({
   auth:authReducer
});

export const store = legacy_createStore(
  rootReducer,
  applyMiddleware(thunk)
)