import api from "@/config/api";
import { toast } from "sonner";
import {
  ADD_COIN_TO_WATCHLIST_FAILURE,
  ADD_COIN_TO_WATCHLIST_REQUEST,
  ADD_COIN_TO_WATCHLIST_SUCCESS,
  GET_USER_WATCHLIST_FAILURE,
  GET_USER_WATCHLIST_REQUEST,
  GET_USER_WATCHLIST_SUCCESS,
} from "./ActionWatchlistType";

// Matches @GetMapping on /api/watchlist
export const getUserWatchlist = (jwt) => async (dispatch) => {
  dispatch({ type: GET_USER_WATCHLIST_REQUEST });

  try {
    const response = await api.get("/api/watchlist", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    dispatch({
      type: GET_USER_WATCHLIST_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: GET_USER_WATCHLIST_FAILURE,
      error: error.response?.data?.message || error.message,
    });
  }
};

// Matches @PostMapping("/coin/{coinId}/toggle") on /api/watchlist
export const addItemToWatchlist =
  ({ coinId, jwt }) =>
  async (dispatch) => {
    dispatch({ type: ADD_COIN_TO_WATCHLIST_REQUEST });

    try {
      const response = await api.post(
        `/api/watchlist/coin/${coinId}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      toast.success("Watchlist updated successfully!");

      dispatch({
        type: ADD_COIN_TO_WATCHLIST_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to update watchlist";

      toast.error(errorMessage);

      dispatch({
        type: ADD_COIN_TO_WATCHLIST_FAILURE,
        error: errorMessage,
      });
    }
  };