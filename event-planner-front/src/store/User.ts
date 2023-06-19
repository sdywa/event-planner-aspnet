import { makeAutoObservable } from "mobx";

import { getErrors } from "../api";
import { UserService } from "../api/services/UserService";
import { IToken, IUser, UserRole } from "../types/Api";

export class User {
    user = {} as IUser;
    isAuth = false;
    isCreator = false;

    constructor() {
        makeAutoObservable(this);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        this.setUser(user);
        this.setAuth(Object.keys(user).length > 1);
    }

    setAuth(value: boolean) {
        this.isAuth = value;
    }

    setUser(value: IUser) {
        this.user = value;
        this.user.role = UserRole[this.user.role] as unknown as UserRole; // force use UserRole
        this.isCreator = this.user.role === UserRole.Organizer;
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
            this.setUser({
                role: UserRole[UserRole.Guest] as unknown as UserRole,
            } as IUser);
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
            this.user.role = UserRole.Organizer;
            this.setUser(this.user);
        } catch (e) {
            return getErrors(e);
        }
    }
}
