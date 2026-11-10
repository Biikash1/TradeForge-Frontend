import axios from "axios";

export const API_BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {

    // 1. Handle Rate Limiting (429) globally
    if (error.response && error.response.status === 429) {
      console.warn("Rate limit exceeded:", error.response.data?.message);
      // The error will be rejected and naturally picked up by your Redux thunks or catch blocks,
      // which will display the backend's "Please try again in X seconds" message.
    }

    // 2. Handle Unauthorized (401)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("jwt");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default api;