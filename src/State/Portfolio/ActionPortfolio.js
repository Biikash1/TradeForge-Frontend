import api from "@/config/api";
import {
    GET_PORTFOLIO_ANALYTICS_FAILURE,
    GET_PORTFOLIO_ANALYTICS_REQUEST, 
    GET_PORTFOLIO_ANALYTICS_SUCCESS
    } from "./PortfolioActionType"
import { toast } from "sonner";

export const getPortfolioAnalytics = (jwt) => async (dispatch) => {
    dispatch({ type: GET_PORTFOLIO_ANALYTICS_REQUEST});

    try {
        const response = await api.get("/api/portfolio/analysis", {
            headers: {Authorization: `Bearer ${jwt}` },
        });

        dispatch({
            type: GET_PORTFOLIO_ANALYTICS_SUCCESS,
            payload: response.data,
        });
    } catch(error) {
        const errorMessage = 
            error.response?.data?.message || error.message || "Failed to fetch analytics";

        toast.error(errorMessage);
        dispatch({
            type: GET_PORTFOLIO_ANALYTICS_FAILURE,
            error: errorMessage,
        });
    }
};