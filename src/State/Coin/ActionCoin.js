import api from "@/config/api";
import {
  FETCH_COIN_BY_ID_FAILURE,
  FETCH_COIN_BY_ID_REQUEST,
  FETCH_COIN_BY_ID_SUCCESS,
  FETCH_COIN_DETAILS_FAILURE,
  FETCH_COIN_DETAILS_REQUEST,
  FETCH_COIN_DETAILS_SUCCESS,
  FETCH_COIN_LIST_FAILURE,
  FETCH_COIN_LIST_REQUEST,
  FETCH_COIN_LIST_SUCCESS,
  FETCH_MARKET_CHART_FAILURE,
  FETCH_MARKET_CHART_REQUEST,
  FETCH_MARKET_CHART_SUCCESS,
  FETCH_TOP_50_COIN_FAILURE,
  FETCH_TOP_50_COIN_REQUEST,
  FETCH_TOP_50_COIN_SUCCESS,
  SEARCH_COIN_FAILURE,
  SEARCH_COIN_REQUEST,
  SEARCH_COIN_SUCCESS,
} from "./CoinActionType";

export const getCoinList = (page = 1) => async (dispatch) => {
  dispatch({ type: FETCH_COIN_LIST_REQUEST });

  try {
    const response = await api.get(`/api/coins?page=${page}`);
    console.log("Coin list:", response.data);

    dispatch({ type: FETCH_COIN_LIST_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
  const errorMsg = error.response?.data?.message || error.message;
  console.error("Fetch Coin List Error:", errorMsg);
  dispatch({ type: FETCH_COIN_LIST_FAILURE, payload: errorMsg });
  throw new Error(errorMsg); // Allows callers to catch the failure
}
};

export const getTop50CoinList = () => async (dispatch) => {
  dispatch({ type: FETCH_TOP_50_COIN_REQUEST });

  try {
    const response = await api.get("/api/coins/top50");
    dispatch({ type: FETCH_TOP_50_COIN_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    console.error("Fetch Top 50 Error:", errorMsg);
    dispatch({ type: FETCH_TOP_50_COIN_FAILURE, payload: errorMsg });
  }
};

export const fetchMarketChart = ({ coinId, days }) => async (dispatch) => {
  dispatch({ type: FETCH_MARKET_CHART_REQUEST });

  try {
    const response = await api.get(`/api/coins/${coinId}/chart?days=${days}`);
    dispatch({ type: FETCH_MARKET_CHART_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    console.error("Fetch Market Chart Error:", errorMsg);
    dispatch({ type: FETCH_MARKET_CHART_FAILURE, payload: errorMsg });
  }
};

export const fetchCoinById = (coinId) => async (dispatch) => {
  dispatch({ type: FETCH_COIN_BY_ID_REQUEST });

  try {
    const response = await api.get(`/api/coins/details/${coinId}`);
    dispatch({ type: FETCH_COIN_BY_ID_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    console.error("Fetch Coin By Id Error:", errorMsg);
    dispatch({ type: FETCH_COIN_BY_ID_FAILURE, payload: errorMsg });
  }
};

export const fetchCoinDetails = ({ coinId }) => async (dispatch) => {
  dispatch({ type: FETCH_COIN_DETAILS_REQUEST });

  try {
    const response = await api.get(`/api/coins/details/${coinId}`);
    dispatch({ type: FETCH_COIN_DETAILS_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    console.error("Fetch Coin Details Error:", errorMsg);
    dispatch({ type: FETCH_COIN_DETAILS_FAILURE, payload: errorMsg });
  }
};

export const searchCoin = (keyword) => async (dispatch) => {
  dispatch({ type: SEARCH_COIN_REQUEST });

  try {
    const response = await api.get(`/api/coins/search?q=${keyword}`);
    dispatch({ type: SEARCH_COIN_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    console.error("Search Coin Error:", errorMsg);
    dispatch({ type: SEARCH_COIN_FAILURE, payload: errorMsg });
  }
};