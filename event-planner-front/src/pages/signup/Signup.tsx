import React, { FC, useState } from "react";
import { AuthForm } from "../../components/UI/auth-form/AuthForm";
import { FormInput } from "../../components/UI/input/FormInput";
import { IS_NOT_EMPTY, MIN_LENGTH, MAX_LENGTH, EMAIL_ADDRESS } from "../../hooks/useValidation";
import { IFormInputData, IFieldStatus, IServerError } from "../../types/index";
import useErrors from "../../hooks/useErrors";

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
        repeatPassword: {
            label: "Подтвердите пароль",
            type: "password",
            autoComplete: "current-password",
            validation: [IS_NOT_EMPTY("Повторите пароль"), MIN_LENGTH(8), MAX_LENGTH(70)]
        },
    };

    const [serverErrors, setServerErrors] = useState<IServerError>({});
    const [isSubmitted, setSubmitted] = useState(false);
    const [fieldStatuses, setFieldStatuses] = useState<{[key: string]: IFieldStatus}>({});
    const hasError = useErrors(serverErrors, fieldStatuses);
    const updateFieldStatuses = (name: string, value: IFieldStatus) => setFieldStatuses((currValue) => {
        const result = {...currValue};
        result[name] = value;
        return result;
    });

    function SubmitHandler(e: React.SyntheticEvent) {
        e.preventDefault();

        setSubmitted(true);
        if (!hasError) {
            setServerErrors({email: "Email занят"});
            for (const key in fieldStatuses) {
                const status = fieldStatuses[key];
                if (status.name === "email") {
                    status.removeDirty();          
                }
            }
        }
    }

    return (
        <AuthForm 
            selectedTabIndex={1} 
            hasError={hasError} 
            isSubmitted={isSubmitted} 
            onSubmit={SubmitHandler}>
            {
                Object.entries(data).map(([k, v]) => 
                    <FormInput 
                        key={k} 
                        name={k} 
                        data={v} 
                        serverError={serverErrors[k]} 
                        isSubmitted={isSubmitted} 
                        callBack={updateFieldStatuses} />)
            }
        </AuthForm>
    );
}
