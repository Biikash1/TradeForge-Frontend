import {
  ADD_COIN_TO_WATCHLIST_FAILURE,
  ADD_COIN_TO_WATCHLIST_REQUEST,
  ADD_COIN_TO_WATCHLIST_SUCCESS,
  GET_USER_WATCHLIST_FAILURE,
  GET_USER_WATCHLIST_REQUEST,
  GET_USER_WATCHLIST_SUCCESS,
} from "./ActionWatchlistType";

const initialState = {
  watchlist: null,
  items: [],
  loading: false,
  error: null,
};

const watchlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_WATCHLIST_REQUEST:
    case ADD_COIN_TO_WATCHLIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_USER_WATCHLIST_SUCCESS:
    case ADD_COIN_TO_WATCHLIST_SUCCESS: {
      const coinsList =
        action.payload?.coins ||
        (Array.isArray(action.payload) ? action.payload : []);

      return {
        ...state,
        watchlist: action.payload,
        items: coinsList,
        loading: false,
        error: null,
      };
    }

    case GET_USER_WATCHLIST_FAILURE:
    case ADD_COIN_TO_WATCHLIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    default:
      return state;
  }
};

export default watchlistReducer;