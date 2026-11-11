import {
  GET_PORTFOLIO_ANALYTICS_FAILURE,
  GET_PORTFOLIO_ANALYTICS_REQUEST,
  GET_PORTFOLIO_ANALYTICS_SUCCESS,
} from "./PortfolioActionType";

const initialState = {
  analytics: null,
  loading: false,
  error: null,
};

const portfolioReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PORTFOLIO_ANALYTICS_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_PORTFOLIO_ANALYTICS_SUCCESS:
      return { ...state, analytics: action.payload, loading: false, error: null };
    case GET_PORTFOLIO_ANALYTICS_FAILURE:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default portfolioReducer;