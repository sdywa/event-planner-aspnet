import React, { FC, useState } from "react";
import { AuthForm } from "../../components/UI/auth-form/AuthForm";
import { FormInput } from "../../components/UI/input/FormInput";
import { IS_NOT_EMPTY, MAX_LENGTH, EMAIL_ADDRESS } from "../../hooks/useValidation";
import { IFormInputData, IFieldStatus, IServerError } from "../../types/index";
import useErrors from "../../hooks/useErrors";

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

    const [serverErrors, setServerErrors] = useState<IServerError>({});
    const [isSubmitted, setSubmitted] = useState(false);
    const [fieldStatuses, setFieldStatuses] = useState<{[key: string]: IFieldStatus}>({});
    const hasError = useErrors(serverErrors, fieldStatuses);
    const updateFieldStatuses = (name: string, value: IFieldStatus) => setFieldStatuses((currValue) => {
        const result = {...currValue};
        result[name] = value;
        return result;
    });

    function submitHandler(e: React.SyntheticEvent) {
        e.preventDefault();             
        setSubmitted(true);
        if (!hasError) {
            setServerErrors({email: "Пользователь не найден"});
            for (const key in fieldStatuses) {
                const status = fieldStatuses[key];
                if (status.name === "email") {
                    status.removeDirty();          
                }
            }
        }
    }

    return (
        <AuthForm selectedTabIndex={0} hasError={hasError} isSubmitted={isSubmitted} onSubmit={submitHandler}>
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
