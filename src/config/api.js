import axios from "axios";

export const API_BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // IMPORTANT: Send cookies with requests
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
  async (error) => {
    const originalRequest = error.config;

    // Handle Rate Limiting (429) globally
    if (error.response?.status === 429) {
      console.warn("Rate limit exceeded:", error.response.data?.message);
      return Promise.reject(error);
    }

    // Skip interceptor loop if the failing request WAS the refresh token request itself
    if (originalRequest.url.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Silent background refresh call utilizing the HttpOnly cookie
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newJwt = data.jwt;
        localStorage.setItem("jwt", newJwt);
        
        // Update header for current and queued requests
        api.defaults.headers.common["Authorization"] = `Bearer ${newJwt}`;
        originalRequest.headers.Authorization = `Bearer ${newJwt}`;
        
        processQueue(null, newJwt);
        return api(originalRequest);
        
      } catch (refreshError) {
        // Refresh token is expired or invalid
        processQueue(refreshError, null);
        localStorage.removeItem("jwt");
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;