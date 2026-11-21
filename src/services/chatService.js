import api from "@/config/api";

export const fetchBotResponse = async (prompt) => {
  const response = await api.post("/api/chat", { prompt });
  return response.data?.message || response.data?.response || response.data;
};

export const fetchPreTradeInsight = async (coinId, quantity, orderType) => {
  const response = await api.post("/api/chat/trade-insight", {
    coinId,
    quantity,
    orderType,
  });
  return response.data?.message || response.data?.response || response.data;
};