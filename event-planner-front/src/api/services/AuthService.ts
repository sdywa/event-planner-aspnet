import api from "..";

const AuthService = {
    signup: async (data: {name: string, surname: string, email: string, password: string}) => {
        console.log(data);
        return api.post("/user/signup", data);
    }
}

export default AuthService;
