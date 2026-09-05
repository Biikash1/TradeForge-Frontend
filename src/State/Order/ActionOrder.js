import api from "@/config/api";
import { toast } from "sonner";
import * as types from "./OrderActionType";

export const payOrder =
  ({ jwt, orderData }) =>
  async (dispatch) => {
    dispatch({ type: types.PAY_ORDER_REQUEST });

    try {
      const response = await api.post("/api/orders", orderData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      toast.success("Order executed successfully!");

      dispatch({
        type: types.PAY_ORDER_SUCCESS,
        payload: response.data,
      });

      return true; // Used to trigger redirect in the component
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to process order";

      toast.error(errorMessage);
      console.error("Order process error:", error);

      dispatch({
        type: types.PAY_ORDER_FAILURE,
        error: errorMessage,
      });

      return false;
    }
  };

export const getOrderById =
  ({ jwt, orderId }) =>
  async (dispatch) => {
    dispatch({ type: types.GET_ORDER_REQUEST });

    try {
      const response = await api.get(`/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      dispatch({
        type: types.GET_ORDER_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch order";

      toast.error(errorMessage);

      dispatch({
        type: types.GET_ORDER_FAILURE,
        error: errorMessage,
      });
    }
  };

export const getAllOrderForUser =
  ({ jwt, orderType, assetSymbol }) =>
  async (dispatch) => {
    dispatch({ type: types.GET_ALL_ORDERS_REQUEST });

    try {
      const response = await api.get("/api/orders", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        params: {
          orderType: orderType || undefined,
          assetSymbol: assetSymbol || undefined,
        },
      });

      dispatch({
        type: types.GET_ALL_ORDERS_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch orders";

      toast.error(errorMessage);
      console.error("Fetch orders error:", error);

      dispatch({
        type: types.GET_ALL_ORDERS_FAILURE,
        error: errorMessage,
      });
    }
  };