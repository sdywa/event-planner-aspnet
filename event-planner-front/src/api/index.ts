import axios from "axios";
import { AxiosError } from "axios";

import { IServerResponse, IToken } from "../types/Api";

import { UserService } from "./services/UserService";

export const API_URL = "https://localhost:7222/api";

export const api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
});

export function isAxiosError<ResponseType>(
    error: unknown
): error is AxiosError<ResponseType> {
    return axios.isAxiosError(error);
}

export function getErrors(e: unknown) {
    if (isAxiosError<IServerResponse>(e)) {
        const errors = e.response?.data.errors;
        if (!errors) return;
        const parsed = Object.entries(errors).map(([key, errors]) => [
            key.toLowerCase(),
            typeof errors === "string" ? errors : errors[0],
        ]);
        return Object.fromEntries(parsed);
    }
}

api.interceptors.request.use((config) => {
    config.headers.set("Access-Control-Allow-Origin", "*");
    if (config.data && Object.keys(config.data).length === 0)
        config.headers.set("Content-Type", "multipart/form-data");
    else config.headers.set("Content-Type", "application/json");

    const accessToken: IToken = JSON.parse(
        localStorage.getItem("accessToken") || "{}"
    );
    config.headers.Authorization = `Bearer ${accessToken.token}`;

    return config;
});

api.interceptors.response.use(
    (config) => config,
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response.status === 401 &&
            error.config &&
            !error.config._isRetry
        ) {
            const refreshToken: IToken = JSON.parse(
                localStorage.getItem("refreshToken") || "{}"
            );
            if (Object.keys(refreshToken).length > 0) {
                originalRequest._isRetry = true;
                try {
                    const response = await UserService.refreshToken({
                        token: refreshToken.token,
                    });
                    localStorage.setItem(
                        "accessToken",
                        JSON.stringify(response.data.accessToken)
                    );
                    localStorage.setItem(
                        "refreshToken",
                        JSON.stringify(response.data.refreshToken)
                    );
                    return api.request(originalRequest);
                } catch (e) {
                    localStorage.removeItem("user");
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    window.location.reload();
                }
            }
        }
        throw error;
    }
);
