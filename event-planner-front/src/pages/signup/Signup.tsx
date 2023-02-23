import { FC } from "react";
import { AuthForm } from "../../components/UI/forms/auth-form/AuthForm";
import { IS_NOT_EMPTY, MIN_LENGTH, MAX_LENGTH, EMAIL_ADDRESS } from "../../hooks/useValidation";
import { IFormInputData, IFormInputStatus, IServerError } from "../../types/index";

export const Signup: FC = () => {
    const data: { [key: string]: IFormInputData } = {
        name: {
            label: "Ваше имя",
            type: "text",
            autoComplete: "off",
            validation: [IS_NOT_EMPTY("Укажите имя"), MIN_LENGTH(2), MAX_LENGTH(30)]
        },
        surname: {
            label: "Ваша фамилия",
            type: "text",
            autoComplete: "off",
            validation: [IS_NOT_EMPTY("Укажите фамилию"), MIN_LENGTH(2), MAX_LENGTH(45)]
        },
        email: {
            label: "Email",
            type: "text",
            autoComplete: "username",
            validation: [IS_NOT_EMPTY("Укажите email"), MAX_LENGTH(50), EMAIL_ADDRESS()]
        },
        password: {
            label: "Пароль",
            type: "password",
            autoComplete: "current-password",
            validation: [IS_NOT_EMPTY("Укажите пароль"), MIN_LENGTH(8), MAX_LENGTH(70)]
        },
        passwordConfirm: {
            label: "Подтвердите пароль",
            type: "password",
            autoComplete: "current-password",
            validation: [IS_NOT_EMPTY("Повторите пароль"), MIN_LENGTH(8), MAX_LENGTH(70)]
        },
    };

    function sendFormData(data: {[key: string]: IFormInputStatus}): IServerError {
        console.log("sent!");
        if (data["password"].value !== data["passwordConfirm"].value)
            return { passwordConfirm: "Пароль не совпадает"};

        return {
            email: "Email занят"
        };
    }

    return (
        <AuthForm selectedTabIndex={1} data={data} sendFormData={sendFormData}  />
    );
}
