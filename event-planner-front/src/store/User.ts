import { makeAutoObservable } from "mobx";
import { getErrors } from "../api";
import AuthService from "../api/services/AuthService";
import { IUser, IToken } from "../types/Api";

export default class User {
    user = {} as IUser;
    isAuth = false;
    isCreator = false;

    constructor() {
        makeAutoObservable(this);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        this.setUser(user);
        this.setAuth(Object.keys(user).length > 0);
    }

    setAuth(value: boolean) {
        this.isAuth = value;
    }

    setUser(value: IUser) {
        this.user = value;
        this.isCreator = value.role === "Organizer" || value.role === "Administrator";
        localStorage.setItem("user", JSON.stringify(value));
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
            return getErrors(e);
        }
    }

    async logout() {
        try {
            const refreshToken: IToken = JSON.parse(localStorage.getItem("refreshToken") || "{}");
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
