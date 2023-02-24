import { makeAutoObservable } from "mobx";
import { getErrors, isAxiosError } from "../api";
import AuthService from "../api/services/AuthService";
import { IUser } from "../types/Api";

export default class User {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(value: boolean) {
        this.isAuth = value;
    }

    setUser(value: IUser) {
        this.user = value;
    }

    async signup(data: {name: string, surname: string, email: string, password: string}) {
        try {
            await AuthService.signup(data);
        } catch (e) {
            return getErrors(e);
        }
    }

    async login(data: {email: string, password: string}) {
        try {
            const response = await AuthService.login(data);
            if (response.data.user === undefined)
                return;
                
            localStorage.setItem("accessToken", JSON.stringify(response.data.accessToken));
            localStorage.setItem("refreshToken", JSON.stringify(response.data.refreshToken));
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            console.log(e);
            return getErrors(e);
        }
    }
}
