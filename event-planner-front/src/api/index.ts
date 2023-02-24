import axios from "axios";
import { AxiosError } from "axios";
import { IServerResponse } from "../types/Api";

export const API_URL = `https://localhost:7222/api`;

const api = axios.create({
    withCredentials: true,
    baseURL: API_URL
});

export function isAxiosError<ResponseType>(error: unknown): error is AxiosError<ResponseType> {
    return axios.isAxiosError(error);
}

export function getErrors(e: any) {
    if (isAxiosError<IServerResponse>(e)) {
        const errors = e.response?.data.errors;
        if (!errors)
            return;
        const parsed = Object.entries(errors).map(([key, errors]) => [key.toLowerCase(), typeof(errors) === "string" ? errors : errors[0]]);
        return Object.fromEntries(parsed);
    }
}

api.interceptors.request.use((config) => {
    config.headers.set("Access-Control-Allow-Origin", "*");
    config.headers.set("Content-Type", "application/json");
    return config;
});

export default api;
