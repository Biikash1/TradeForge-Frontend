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

const initialState = {
  asset: null,
  userAssets: [],
  assetDetails: null,
  loading: false,
  error: null,
};

const assetReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ASSET_REQUEST:
    case GET_USER_ASSETS_REQUEST:
    case GET_ASSETS_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_ASSET_SUCCESS:
      return {
        ...state,
        asset: action.payload,
        loading: false,
        error: null,
      };

    case GET_ASSETS_DETAILS_SUCCESS:
      return {
        ...state,
        assetDetails: action.payload,
        loading: false,
        error: null,
      };

    case GET_USER_ASSETS_SUCCESS:
      return {
        ...state,
        userAssets: Array.isArray(action.payload) ? action.payload : [],
        loading: false,
        error: null,
      };

    case GET_ASSET_FAILURE:
    case GET_USER_ASSETS_FAILURE:
    case GET_ASSETS_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    default:
      return state;
  }
};

export default assetReducer;