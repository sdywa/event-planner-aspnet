import { FC, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../..";
import { AuthForm } from "../../components/UI/forms/auth-form/AuthForm";
import { IS_NOT_EMPTY, MAX_LENGTH, EMAIL_ADDRESS } from "../../hooks/useValidation";
import { IFormInputData, IFormInputStatus, IServerError } from "../../types/index";

export const Login: FC = () => {
    const {user} = useContext(Context);
    const navigate = useNavigate();
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

    async function sendFormData(data: {[key: string]: IFormInputStatus}): Promise<IServerError> {
        console.log("sent!");
        const result = Object.entries(data).map(([key, d]) => [key, d.value]);

        console.log(result);

        let errors = {};
        await user.login(Object.fromEntries(result))
            .then((e) => {
                errors = e;
                console.log(e);
                if (!errors)
                    navigate("/events");
            });

        return errors;
    }

    return (
        <AuthForm selectedTabIndex={0} data={data} sendFormData={sendFormData} />
    );
}
