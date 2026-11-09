import { API_BASE_URL } from "@/config/api";
import axios from "axios";

export const fetchBotResponse = async (prompt) => {
  const token = localStorage.getItem("jwt");
  const cleanToken = token?.startsWith("{") ? JSON.parse(token)?.jwt : token;

  const response = await axios.post(
    `${API_BASE_URL}/api/chat`,
    { prompt },
    {
      headers: {
        "Content-Type": "application/json",
        ...(cleanToken ? { Authorization: `Bearer ${cleanToken}` } : {}),
      },
    }
  );
  
  return response.data?.message || response.data?.response || response.data;
};

export const fetchPreTradeInsight = async (coinId, quantity, orderType) => {
  const token = localStorage.getItem("jwt");
  const cleanToken = token?.startsWith("{") ? JSON.parse(token)?.jwt : token;

  const response = await axios.post(
    `${API_BASE_URL}/api/chat/trade-insight`,
    { coinId, quantity, orderType },
    {
      headers: {
        "Content-Type": "application/json",
        ...(cleanToken ? { Authorization: `Bearer ${cleanToken}` } : {}),
      },
    }
  );

  return response.data?.message || response.data?.response || response.data;
};