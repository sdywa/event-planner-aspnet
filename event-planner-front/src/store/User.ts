import { makeAutoObservable } from "mobx";
import { isAxiosError } from "../api";
import AuthService from "../api/services/AuthService";
import { ServerResponse } from "../types/Api";

export default class User {
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    async signup(data: {name: string, surname: string, email: string, password: string}) {
        try {
            const response = await AuthService.signup(data);
            console.log(response);
        } catch (e) {
            console.log(e);
            if (isAxiosError<ServerResponse>(e)) {
                const errors = e.response?.data.errors;
                if (!errors)
                    return;
                const parsed = Object.entries(errors).map(([key, errors]) => [key.toLowerCase(), typeof(errors) === "string" ? errors : errors[0]]);
                return Object.fromEntries(parsed);
            }
        }
    }
}
