import api from "..";
import { IAuthResponse } from "../../types/Api";

const AuthService = {
    signup: async (data: {name: string, surname: string, email: string, password: string}) => 
        api.post("/user/signup", data),
    login: async (data: {email: string, password: string}) =>
        api.post<IAuthResponse>("/user/login", data),
    refreshToken: async (data: {token: string}) =>
        api.post<IAuthResponse>("/user/refreshToken", data),
    logout: async (data: {token: string}) =>
        api.post("/user/logout", data)
}

export default AuthService;
