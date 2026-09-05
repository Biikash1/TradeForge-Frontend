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

const initialState = {
  withdrawal: null,
  history: [],
  loading: false,
  error: null,
  paymentDetails: [], // Always maintain an array for multi-account support
  requests: [],
};

const withdrawalReducer = (state = initialState, action) => {
  switch (action.type) {
    case WITHDRAWAL_REQUEST:
    case WITHDRAWAL_PROCED_REQUEST:
    case GET_WITHDRAWAL_HISTORY_REQUEST:
    case GET_WITHDRAWAL_REQUEST_REQUEST:
    case GET_PAYMENT_DETAILS_REQUEST:
    case ADD_PAYMENT_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case WITHDRAWAL_SUCCESS:
      return {
        ...state,
        withdrawal: action.payload,
        loading: false,
        error: null,
      };

    case GET_PAYMENT_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        paymentDetails: Array.isArray(action.payload)
          ? action.payload
          : action.payload
          ? [action.payload]
          : [],
        error: null,
      };

    case ADD_PAYMENT_DETAILS_SUCCESS: {
      const currentList = Array.isArray(state.paymentDetails)
        ? state.paymentDetails
        : [];
      const updatedList = currentList.filter(
        (item) => item.id !== action.payload.id
      );
      return {
        ...state,
        loading: false,
        paymentDetails: [action.payload, ...updatedList],
        error: null,
      };
    }

    case WITHDRAWAL_PROCED_SUCCESS:
      return {
        ...state,
        requests: state.requests.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
        loading: false,
        error: null,
      };

    case GET_WITHDRAWAL_HISTORY_SUCCESS:
      return {
        ...state,
        history: action.payload,
        loading: false,
        error: null,
      };

    case GET_WITHDRAWAL_REQUEST_SUCCESS:
      return {
        ...state,
        requests: action.payload,
        loading: false,
        error: null,
      };

    case WITHDRAWAL_FAILURE:
    case WITHDRAWAL_PROCED_FAILURE:
    case GET_WITHDRAWAL_REQUEST_FAILURE:
    case GET_WITHDRAWAL_HISTORY_FAILURE:
    case GET_PAYMENT_DETAILS_FAILURE:
    case ADD_PAYMENT_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default withdrawalReducer;