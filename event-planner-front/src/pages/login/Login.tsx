import { FC } from "react";
import { AuthForm } from "../../components/UI/auth-form/AuthForm";
import { Input } from "../../components/UI/input/Input";

export const Login: FC = () => {
    return (
        <AuthForm selectedTabIndex={0}>
            <Input type="text" name="email" label="Email" autocomplete="off" />
            <Input type="password" name="password" label="Пароль" autocomplete="off" />
        </AuthForm>
    );
}
