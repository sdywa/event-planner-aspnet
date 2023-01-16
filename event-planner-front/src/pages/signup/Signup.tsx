import { FC } from "react";
import { AuthForm } from "../../components/UI/auth-form/AuthForm";
import { Input } from "../../components/UI/input/Input";

export const Signup: FC = () => {
    return (
        <AuthForm selectedTabIndex={1}>
            <Input type="text" name="name" label="Ваше имя" autocomplete="off" />
            <Input type="text" name="surname" label="Ваша фамилия" autocomplete="off" />
            <Input type="text" name="email" label="Email" autocomplete="off" />
            <Input type="password" name="password" label="Пароль" autocomplete="off" />
            <Input type="password" name="password" label="Подтвердите пароль" autocomplete="off" />
        </AuthForm>
    );
}
