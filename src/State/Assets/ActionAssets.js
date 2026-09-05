import api from "@/config/api";
import { toast } from "sonner";
import {
  GET_ASSET_FAILURE,
  GET_ASSET_REQUEST,
  GET_ASSET_SUCCESS,
  GET_ASSETS_DETAILS_FAILURE,
  GET_ASSETS_DETAILS_REQUEST,
  GET_ASSETS_DETAILS_SUCCESS,
  GET_USER_ASSETS_FAILURE,
  GET_USER_ASSETS_REQUEST,
  GET_USER_ASSETS_SUCCESS,
} from "./AssetsActionType";

export const getAssetById =
  ({ assetId, jwt }) =>
  async (dispatch) => {
    dispatch({ type: GET_ASSET_REQUEST });

    try {
      const response = await api.get(`/api/assets/${assetId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      dispatch({
        type: GET_ASSET_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch asset";

      toast.error(errorMessage);

      dispatch({
        type: GET_ASSET_FAILURE,
        error: errorMessage,
      });
    }
  };

export const getAssetDetails =
  ({ coinId, jwt }) =>
  async (dispatch) => {
    dispatch({ type: GET_ASSETS_DETAILS_REQUEST });

    try {
      const response = await api.get(`/api/assets/coin/${coinId}/user`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      dispatch({
        type: GET_ASSETS_DETAILS_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      const status = error.response?.status;
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch asset details";

      // Suppress toast on 404 since users might not own this coin yet
      if (status !== 404) {
        toast.error(errorMessage);
      }

      dispatch({
        type: GET_ASSETS_DETAILS_FAILURE,
        error: errorMessage,
      });
    }
  };

export const getUserAssets = (jwt) => async (dispatch) => {
  dispatch({ type: GET_USER_ASSETS_REQUEST });

  try {
    const response = await api.get(`/api/assets`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    dispatch({
      type: GET_USER_ASSETS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch user assets";

    toast.error(errorMessage);

    dispatch({
      type: GET_USER_ASSETS_FAILURE,
      error: errorMessage,
    });
  }
};
