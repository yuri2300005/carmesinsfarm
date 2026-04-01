import axios from "axios";

const api = axios.create({
  baseURL: "https://carmesinsfarm-production.up.railway.app/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cf_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
