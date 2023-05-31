import React, { FC } from "react";
import { useNavigate } from "react-router-dom";

import { AuthForm } from "../components/UI/forms/AuthForm";
import { useUser } from "../hooks/useUserContext";
import {
    EMAIL_ADDRESS,
    IS_NOT_EMPTY,
    MAX_LENGTH,
    MIN_LENGTH,
} from "../hooks/useValidation";
import { IFormInputData, IFormInputStatus, IServerError } from "../types/index";

export const Signup: FC = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const data: { [key: string]: IFormInputData } = {
        name: {
            label: "Ваше имя",
            type: "text",
            autoComplete: "off",
            validation: [
                IS_NOT_EMPTY("Укажите имя"),
                MIN_LENGTH(2),
                MAX_LENGTH(30),
            ],
        },
        surname: {
            label: "Ваша фамилия",
            type: "text",
            autoComplete: "off",
            validation: [
                IS_NOT_EMPTY("Укажите фамилию"),
                MIN_LENGTH(2),
                MAX_LENGTH(45),
            ],
        },
        email: {
            label: "Email",
            type: "text",
            autoComplete: "username",
            validation: [
                IS_NOT_EMPTY("Укажите email"),
                MAX_LENGTH(50),
                EMAIL_ADDRESS(),
            ],
        },
        password: {
            label: "Пароль",
            type: "password",
            autoComplete: "current-password",
            validation: [
                IS_NOT_EMPTY("Укажите пароль"),
                MIN_LENGTH(8),
                MAX_LENGTH(70),
            ],
        },
        passwordConfirm: {
            label: "Подтвердите пароль",
            type: "password",
            autoComplete: "current-password",
            validation: [
                IS_NOT_EMPTY("Повторите пароль"),
                MIN_LENGTH(8),
                MAX_LENGTH(70),
            ],
        },
    };

    async function sendFormData(data: {
        [key: string]: IFormInputStatus;
    }): Promise<IServerError> {
        console.log("sent!");
        if (data["password"].value !== data["passwordconfirm"].value)
            return { passwordConfirm: "Пароль не совпадает" };

        const result = Object.entries(data).map(([key, d]) => [key, d.value]);

        let errors = {};
        await user.signup(Object.fromEntries(result)).then((e) => {
            errors = e;
            if (!errors) navigate("/login");
        });

        return errors;
    }

    return (
        <AuthForm
            selectedTabIndex={1}
            data={data}
            sendFormData={sendFormData}
        />
    );
};
