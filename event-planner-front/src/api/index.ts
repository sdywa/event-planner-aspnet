import axios from "axios";
import { AxiosError } from "axios";

export const API_URL = `https://localhost:7222/api`;

const api = axios.create({
    withCredentials: true,
    baseURL: API_URL
});

export function isAxiosError<ResponseType>(error: unknown): error is AxiosError<ResponseType> {
    return axios.isAxiosError(error);
  }

api.interceptors.request.use((config) => {
    config.headers.set("Access-Control-Allow-Origin", "*");
    config.headers.set("Content-Type", "application/json");
    return config;
});

export default api;
