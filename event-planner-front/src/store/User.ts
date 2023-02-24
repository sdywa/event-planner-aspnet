import { makeAutoObservable } from "mobx";
import { getErrors } from "../api";
import AuthService from "../api/services/AuthService";
import { IUser, IToken } from "../types/Api";

export default class User {
    user = {} as IUser;
    isAuth = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(value: boolean) {
        console.log(1);
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
            console.log(response);
            if (!response || response.data.user === undefined)
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

    async logout() {
        try {
            const refreshToken: IToken = JSON.parse(localStorage.getItem("refreshToken") || "{}");
            console.log(refreshToken);
            await AuthService.logout({token: refreshToken.token});
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (e) {
            console.log(e);
        }
    }
}
