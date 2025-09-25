// src/services/api.js
import axios from "axios";

// URL da sua API hospedada no Render
const API_URL = "https://agenda-digital-api.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
});

// Adiciona automaticamente o token em cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
