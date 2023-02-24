import axios from "axios";
import { AxiosError } from "axios";
import { IServerResponse, IToken } from "../types/Api";
import AuthService from "./services/AuthService";

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

api.interceptors.request.use(async (config) => {
    config.headers.set("Access-Control-Allow-Origin", "*");
    config.headers.set("Content-Type", "application/json");

    let accessToken: IToken = JSON.parse(localStorage.getItem("accessToken") || "");
    if (!accessToken)
        return config;

    if (new Date(accessToken.expires) < new Date())
    {
        console.log("refreshing token...");
        const refreshToken: IToken = JSON.parse(localStorage.getItem("refreshToke") || "");
        if (new Date(refreshToken.expires) < new Date()) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            return config;
        }
        const response = await AuthService.refreshToken({token: refreshToken.token});
        localStorage.setItem("accessToken", JSON.stringify(response.data.accessToken));
        localStorage.setItem("refreshToken", JSON.stringify(response.data.refreshToken));
        accessToken = response.data.accessToken;
    }
    
    config.headers.Authorization = `Bearer ${accessToken.token}`;
    return config;
});

export default api;
