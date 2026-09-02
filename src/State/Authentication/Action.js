import api from "@/config/api";
import { toast } from "sonner";
import {
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
} from "./ActionTypes";

export const Register = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });

  try {
    // Uses relative path with baseUrl automatically applied
    const response = await api.post("/auth/signup", userData);
    const authData = response.data;

    if (authData?.jwt) {
      localStorage.setItem("jwt", authData.jwt);
    }

    toast.success(authData?.message || "User registered successfully!");
    dispatch({ type: REGISTER_SUCCESS, payload: authData });
    return authData;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Registration failed";

    console.error("=== REGISTER ERROR DATA ===", error.response?.data || error);
    toast.error(errorMessage);
    dispatch({ type: REGISTER_FAILURE, payload: errorMessage });
    throw new Error(errorMessage);
  }
};

export const Login = (userData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const response = await api.post("/auth/signin", userData);
    const authData = response.data;

    if (authData?.jwt) {
      localStorage.setItem("jwt", authData.jwt);
    }

    toast.success(authData?.message || "User logged in successfully!");
    dispatch({ type: LOGIN_SUCCESS, payload: authData });
    return authData;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Login failed";

    console.error("=== LOGIN ERROR DATA ===", error.response?.data || error);
    toast.error(errorMessage);
    dispatch({ type: LOGIN_FAILURE, payload: errorMessage });
    throw new Error(errorMessage);
  }
};

export const getUser = () => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });

  try {
    // No need to pass jwt parameter or custom Authorization headers;
    // the interceptor injects the Bearer token automatically!
    const response = await api.get("/api/users/profile");
    const user = response.data;

    dispatch({ type: GET_USER_SUCCESS, payload: user });
    return user;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to fetch user";

    console.error("=== GET USER ERROR ===", error.response?.data || error);
    toast.error(errorMessage);
    dispatch({ type: GET_USER_FAILURE, payload: errorMessage });
    throw new Error(errorMessage);
  }
};

export const logout = () => (dispatch) => {
  localStorage.clear();
  dispatch({ type: LOGOUT });
  toast.success("Logged out successfully!");
};