import api from "@/config/api";
import { toast } from "sonner";
import {
  ADD_PAYMENT_DETAILS_FAILURE,
  ADD_PAYMENT_DETAILS_REQUEST,
  ADD_PAYMENT_DETAILS_SUCCESS,
  GET_PAYMENT_DETAILS_FAILURE,
  GET_PAYMENT_DETAILS_REQUEST,
  GET_PAYMENT_DETAILS_SUCCESS,
  GET_WITHDRAWAL_HISTORY_FAILURE,
  GET_WITHDRAWAL_HISTORY_REQUEST,
  GET_WITHDRAWAL_HISTORY_SUCCESS,
  GET_WITHDRAWAL_REQUEST_FAILURE,
  GET_WITHDRAWAL_REQUEST_REQUEST,
  GET_WITHDRAWAL_REQUEST_SUCCESS,
  WITHDRAWAL_FAILURE,
  WITHDRAWAL_PROCED_FAILURE,
  WITHDRAWAL_PROCED_REQUEST,
  WITHDRAWAL_PROCED_SUCCESS,
  WITHDRAWAL_REQUEST,
  WITHDRAWAL_SUCCESS,
} from "./ActionWithdrawalType";

// POST /api/withdrawal -> body: { amount }
export const withdrawalRequest =
  ({ amount, jwt }) =>
  async (dispatch) => {
    dispatch({ type: WITHDRAWAL_REQUEST });

    try {
      const response = await api.post(
        "/api/withdrawal",
        { amount: Number(amount) },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        },
      );

      toast.success("Withdrawal request submitted successfully!");

      dispatch({
        type: WITHDRAWAL_SUCCESS,
        payload: response.data,
      });

      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Withdrawal request failed";

      toast.error(errorMessage);
      console.error("Withdrawal Error:", error);

      dispatch({
        type: WITHDRAWAL_FAILURE,
        payload: errorMessage,
      });

      return false;
    }
  };

// PATCH /api/withdrawal/{id}/process -> body: { accept }
export const processWithdrawal =
  ({ id, jwt, accept }) =>
  async (dispatch) => {
    dispatch({ type: WITHDRAWAL_PROCED_REQUEST });

    try {
      const response = await api.patch(
        `/api/withdrawal/${id}/process`,
        { accept: Boolean(accept) },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        },
      );

      toast.success(
        accept ? "Withdrawal approved successfully!" : "Withdrawal rejected successfully!",
      );

      dispatch({
        type: WITHDRAWAL_PROCED_SUCCESS,
        payload: response.data,
      });

      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to process withdrawal";

      toast.error(errorMessage);
      console.error("Process Withdrawal Error:", error);

      dispatch({
        type: WITHDRAWAL_PROCED_FAILURE,
        payload: errorMessage,
      });

      return false;
    }
  };

// GET /api/withdrawal (Supports both {jwt} and raw jwt string)
export const getWithdrawalHistory = (param) => async (dispatch) => {
  dispatch({ type: GET_WITHDRAWAL_HISTORY_REQUEST });
  const jwt = typeof param === "string" ? param : param?.jwt;

  try {
    const response = await api.get("/api/withdrawal", {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    dispatch({
      type: GET_WITHDRAWAL_HISTORY_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to load withdrawal history";

    console.error("Withdrawal History Error:", error);

    dispatch({
      type: GET_WITHDRAWAL_HISTORY_FAILURE,
      payload: errorMessage,
    });
  }
};

// GET /api/withdrawal/admin
export const getAllWithdrawalRequest = (param) => async (dispatch) => {
  dispatch({ type: GET_WITHDRAWAL_REQUEST_REQUEST });
  const jwt = typeof param === "string" ? param : param?.jwt;

  try {
    const response = await api.get("/api/withdrawal/admin", {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    dispatch({
      type: GET_WITHDRAWAL_REQUEST_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to load admin withdrawal requests";

    toast.error(errorMessage);
    console.error("Get All Withdrawal Requests Error:", error);

    dispatch({
      type: GET_WITHDRAWAL_REQUEST_FAILURE,
      payload: errorMessage,
    });
  }
};
export const addPaymentDetails =
  ({ paymentDetails, jwt }) =>
  async (dispatch) => {
    dispatch({ type: ADD_PAYMENT_DETAILS_REQUEST });

    try {
      const response = await api.post("/api/payment-details", paymentDetails, {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      toast.success("Bank details saved successfully!");

      dispatch({
        type: ADD_PAYMENT_DETAILS_SUCCESS,
        payload: response.data,
      });

      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to save bank details";

      toast.error(errorMessage);
      console.error("Add Payment Details Error:", error);

      dispatch({
        type: ADD_PAYMENT_DETAILS_FAILURE,
        payload: errorMessage,
      });

      return false;
    }
  };

export const getPaymentDetails = (param) => async (dispatch) => {
  dispatch({ type: GET_PAYMENT_DETAILS_REQUEST });
  const rawJwt = typeof param === "string" ? param : param?.jwt;
  const jwt = rawJwt?.startsWith("{") ? JSON.parse(rawJwt)?.jwt : rawJwt;

  try {
    const response = await api.get("/api/payment-details", {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    console.log("===> RAW BACKEND PAYMENT DETAILS RESPONSE:", response.data);

    dispatch({
      type: GET_PAYMENT_DETAILS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    console.error("===> GET PAYMENT DETAILS FAILED:", error.response?.data || error.message);
    dispatch({
      type: GET_PAYMENT_DETAILS_FAILURE,
      payload: error.message,
    });
  }
};