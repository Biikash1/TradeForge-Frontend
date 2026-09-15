// src/services/chatService.js
import { API_BASE_URL } from "@/config/api";
import axios from "axios";

export const fetchBotResponse = async (prompt) => {
  const token = localStorage.getItem("jwt"); // If endpoint requires authentication
  const response = await axios.post(
    `${API_BASE_URL}/api/chat`,
    { prompt },
    {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
  // Matches ApiResponse (either response.data.message or response.data)
  return response.data?.message || response.data?.response || response.data;
};