import * as types from "./WalletActionTypes";
import api from "@/config/api";
import { toast } from "sonner";

// --- GET USER WALLET ---
export const getUserWallet = (jwt) => async (dispatch) => {
  dispatch({ type: types.GET_USER_WALLET_REQUEST });

  try {
    const response = await api.get("/api/wallet", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    dispatch({
      type: types.GET_USER_WALLET_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    console.error("Get Wallet Error:", errorMsg);
    dispatch({
      type: types.GET_USER_WALLET_FAILURE,
      error: errorMsg,
    });
  }
};

// --- GET WALLET TRANSACTIONS ---
export const getWalletTransactions =
  ({ jwt }) =>
  async (dispatch) => {
    dispatch({ type: types.GET_WALLET_TRANSACTION_REQUEST });

    try {
      const response = await api.get("/api/wallet/transaction", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      dispatch({
        type: types.GET_WALLET_TRANSACTION_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error("Wallet Transactions Error:", errorMsg);
      dispatch({
        type: types.GET_WALLET_TRANSACTION_FAILURE,
        error: errorMsg,
      });
    }
  };

// --- DEPOSIT MONEY ---
export const depositMoney =
  ({ jwt, orderId, paymentId, navigate }) =>
  async (dispatch) => {
    dispatch({ type: types.DEPOSIT_MONEY_REQUEST });

    try {
      const response = await api.post("/api/wallet/deposit", null, {
        params: {
          order_id: orderId,
          payment_id: paymentId,
        },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      toast.success("Deposit verified successfully!");

      dispatch({
        type: types.DEPOSIT_MONEY_SUCCESS,
        payload: response.data,
      });

      dispatch({
        type: types.GET_USER_WALLET_SUCCESS,
        payload: response.data,
      });

      dispatch(getWalletTransactions({ jwt }));

      if (navigate) {
        navigate("/wallet", { replace: true });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      toast.error(errorMsg || "Deposit verification failed");
      dispatch({
        type: types.DEPOSIT_MONEY_FAILURE,
        error: errorMsg,
      });
    }
  };

// --- PAYMENT HANDLER (MISSING EXPORT) ---
export const paymentHandler =
  ({ jwt, amount, paymentMethod }) =>
  async (dispatch) => {
    dispatch({ type: types.DEPOSIT_MONEY_REQUEST });

    try {
      const response = await api.post(
        `/api/payments/${paymentMethod}/amount/${amount}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      console.log("Payment link response:", response.data);

      const redirectUrl =
        response.data?.paymentUrl || response.data?.payment_url;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        toast.error("No payment URL received from gateway.");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Payment initiation failed";

      toast.error(errorMsg);
      console.error("Payment Handler Error:", error);

      dispatch({
        type: types.DEPOSIT_MONEY_FAILURE,
        error: errorMsg,
      });
    }
  };

// --- TRANSFER MONEY ---
export const transferMoney =
  ({ jwt, walletId, reqData }) =>
  async (dispatch) => {
    dispatch({ type: types.TRANSFER_MONEY_REQUEST });

    try {
      const response = await api.post(
        `/api/wallet/${walletId}/transfer`,
        reqData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      toast.success("Transfer completed successfully!");

      dispatch({
        type: types.TRANSFER_MONEY_SUCCESS,
        payload: response.data,
      });

      dispatch(getUserWallet(jwt));
      dispatch(getWalletTransactions({ jwt }));
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Transfer failed. Check balance and wallet ID.";

      toast.error(errorMsg);
      console.error("Transfer Error:", errorMsg);

      dispatch({
        type: types.TRANSFER_MONEY_FAILURE,
        error: errorMsg,
      });
    }
  };