import axios from "axios";
import { toast } from "sonner";
import {
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
} from "./ActionTypes";

const BASE_URL = "http://localhost:8080";

export const Register = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });

  try {
    const response = await axios.post(`${BASE_URL}/auth/signup`, userData);
    const authData = response.data;

    if (authData?.jwt) {
      localStorage.setItem("jwt", authData.jwt);
    }

    // Success Toast Notification at Top
    toast.success(authData?.message || "User registered successfully!");

    dispatch({ type: REGISTER_SUCCESS, payload: authData });
    return authData;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Registration failed";

    console.error("=== REGISTER ERROR DATA ===", error.response?.data || error);

    toast.error(errorMessage);

    dispatch({ type: REGISTER_FAILURE, payload: errorMessage });
  }
};

export const Login = (userData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const response = await axios.post(`${BASE_URL}/auth/signin`, userData);
    const authData = response.data;

    if (authData?.jwt) {
      localStorage.setItem("jwt", authData.jwt);
    }

    // Success Toast Notification at Top
    toast.success(authData?.message || "User logged in successfully!");

    dispatch({ type: LOGIN_SUCCESS, payload: authData });
    return authData;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Login failed";

    console.error("=== LOGIN ERROR DATA ===", error.response?.data || error);
    // Error Toast Notification at Top
    toast.error(errorMessage);

    dispatch({ type: LOGIN_FAILURE, payload: errorMessage });
  }
};

export const getUser = (jwt) => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });

  try {
    const response = await axios.get(`${BASE_URL}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const user = response.data;

    dispatch({ type: GET_USER_SUCCESS, payload: user });
    return user;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to fetch user";

    console.error("=== GET USER ERROR ===", error.response?.data || error);

    toast.error(errorMessage);

    dispatch({ type: GET_USER_FAILURE, payload: errorMessage });
  }
};
