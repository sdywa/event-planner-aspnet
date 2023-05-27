import { makeAutoObservable } from "mobx";

import { getErrors } from "../api";
import { UserService } from "../api/services/UserService";
import { IToken, IUser, UserRoles } from "../types/Api";

export class User {
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
        this.isCreator =
            value.role === "Organizer" || value.role === "Administrator";
        localStorage.setItem("user", JSON.stringify(value));
    }

    async signup(data: {
        name: string;
        surname: string;
        email: string;
        password: string;
        passwordConfirm: string;
    }) {
        try {
            await UserService.signup(data);
        } catch (e) {
            return getErrors(e);
        }
    }

    async login(data: { email: string; password: string }) {
        try {
            const response = await UserService.login(data);
            if (response.data.user === undefined) return;

            localStorage.setItem(
                "accessToken",
                JSON.stringify(response.data.accessToken)
            );
            localStorage.setItem(
                "refreshToken",
                JSON.stringify(response.data.refreshToken)
            );
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            return getErrors(e);
        }
    }

    async logout() {
        try {
            const refreshToken: IToken = JSON.parse(
                localStorage.getItem("refreshToken") || "{}"
            );
            await UserService.logout({ token: refreshToken.token });
        } catch (e) {
            return;
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            this.setAuth(false);
            this.setUser({} as IUser);
        }
    }

    async update(data: {
        name: string;
        surname: string;
        email: string;
        password: string;
        passwordConfirm: string;
    }) {
        try {
            await UserService.update(data);
            this.user.email = data.email;
            this.user.name = data.name;
            this.user.surname = data.surname;
            this.setUser(this.user);
        } catch (e) {
            return getErrors(e);
        }
    }

    async promote() {
        try {
            await UserService.promote();
            this.user.role = UserRoles.Organizer;
            this.setUser(this.user);
        } catch (e) {
            return getErrors(e);
        }
    }
}
