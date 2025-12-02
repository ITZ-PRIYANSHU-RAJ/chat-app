import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: false, // using localStorage refresh token approach
});

// Attach access token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("chat_access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, err => Promise.reject(err));

// Response interceptor: if 401 -> try refresh once
API.interceptors.response.use(
  res => res,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    // only try once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem("chat_refresh");
      if (!refresh) {
        // no refresh token — force logout
        localStorage.removeItem("chat_access");
        localStorage.removeItem("chat_refresh");
        localStorage.removeItem("chat_user");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const resp = await axios.post("http://localhost:3000/api/auth/refresh", { token: refresh });
        const newAccess = resp.data.accessToken;
        localStorage.setItem("chat_access", newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return axios(originalRequest);
      } catch (refreshErr) {
        // refresh failed -> clear storage and redirect to login
        localStorage.removeItem("chat_access");
        localStorage.removeItem("chat_refresh");
        localStorage.removeItem("chat_user");
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
