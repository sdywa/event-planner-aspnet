import { FC } from "react";
import { AuthForm } from "../../components/UI/auth-form/AuthForm";
import { IS_NOT_EMPTY, MAX_LENGTH, EMAIL_ADDRESS } from "../../hooks/useValidation";
import { IFormInputData, IFieldStatus, IServerError } from "../../types/index";

export const Login: FC = () => {
    const data: { [key: string]: IFormInputData } = {
        email: {
            label: "Email",
            type: "text",
            autoComplete: "off",
            validation: [IS_NOT_EMPTY("Укажите email"), MAX_LENGTH(50), EMAIL_ADDRESS()]
        },
        password: {
            label: "Пароль",
            type: "password",
            autoComplete: "off",
            validation: [IS_NOT_EMPTY("Укажите пароль")]
        }
    };

    function sendFormData(data: {[key: string]: IFieldStatus}): IServerError {
        console.log("sended!");
        return {};
    }

    return (
        <AuthForm selectedTabIndex={0} data={data} sendFormData={sendFormData} />
    );
}
