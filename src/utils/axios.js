import axios from "axios";
import {
  BASE_API_URL,
  API_URL,
  USER_TOKEN_STORAGE_KEY,
} from "../constants";

export { API_URL };

const axios_instance = axios.create({ baseURL: BASE_API_URL });

axios_instance.interceptors.request.use(
  (config) => {
    const log_ = {
      method: config.method?.toUpperCase(),
      url: API_URL(config.url),
      data: config.data,
      headers: config.headers,
      timestamp: new Date().toISOString(),
    };
    // infoCommand(`🚀 Request Started: ${JSON.stringify(log_, null, 4)} \n`);

    const user_token = localStorage.getItem(USER_TOKEN_STORAGE_KEY);
    if (user_token) {
      config.headers.Authorization = `Bearer ${user_token}`;
    }
    return config;
  },
  (error) => {
    const log_ = {
      message: error.message,
      timestamp: new Date().toISOString(),
    };

    console.error(`❌ Request Error: ${JSON.stringify(log_, null, 4)} \n`);

    return Promise.reject(error);
  }
);

axios_instance.interceptors.response.use(
  (response) => {
    const log_ = {
      status: response.status,
      statusText: response.statusText,
      url: API_URL(response.config.url),
      method: response.config.method?.toUpperCase(),
      data: response.data,
      timestamp: new Date().toISOString(),
    };
    // infoCommand(`✅ Request Successful: ${JSON.stringify(log_, null, 4)} \n`);

    return response;
  },
  (error) => {
    const log_ = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: API_URL(error.config?.url),
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data,
      timestamp: new Date().toISOString(),
    };

    console.error(`❌ Response Error: ${JSON.stringify(log_, null, 4)} \n`);

    return Promise.reject(error);
  }
);

export default axios_instance;
