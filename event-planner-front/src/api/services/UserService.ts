import api from "..";
import { IAuthResponse } from "../../types/Api";

const UserService = {
    signup: async (data: {name: string, surname: string, email: string, password: string, passwordConfirm: string}) =>
        api.post("/user/signup", data),
    login: async (data: {email: string, password: string}) =>
        api.post<IAuthResponse>("/user/login", data),
    refreshToken: async (data: {token: string}) =>
        api.post<IAuthResponse>("/user/refreshToken", data),
    logout: async (data: {token: string}) =>
        api.post("/user/logout", data),
    update: async (data: {name: string, surname: string, email: string, password?: string, passwordConfirm?: string}) => {
        const formData = new FormData();
        let key: keyof typeof data;
        for (key in data) {
            let value = data[key]!;
            formData.append(key, value);
        }
        console.log(formData);
        return api.patch("/user", data);
    },
    promote: async () =>
        api.post("/user/role")
}

export default UserService;
