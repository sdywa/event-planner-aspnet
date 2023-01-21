import React, { FC, useState } from "react";
import { LinkSwitcher } from "../link-swticher/LinkSwitcher";
import { SubmitButton } from '../button/SubmitButton';
import { FormInput } from "../input/FormInput";
import { IServerError, IFieldStatus, IFormInputData } from "../../../types";
import useFormErrors from "../../../hooks/useFormErrors";
import "./AuthForm.css";

export interface IAuthFormProps {
    selectedTabIndex: 0 | 1;
    data: { [key: string]: IFormInputData },
    sendFormData: (data: {[key: string]: IFieldStatus}) => IServerError;
};

export const AuthForm: FC<IAuthFormProps> = ({selectedTabIndex, data, sendFormData}) => {
    const tabs = [{title: "Вход", link: "/login"}, {title: "Регистрация", link: "/signup"}];
    const activeTab = tabs[selectedTabIndex].title;

    const [serverErrors, setServerErrors] = useState<IServerError>({});
    const [isSubmitted, setSubmitted] = useState(false);
    const [fieldStatuses, setFieldStatuses] = useState<{[key: string]: IFieldStatus}>({});
    const hasError = useFormErrors(serverErrors, fieldStatuses);
    const updateFieldStatuses = (name: string, value: IFieldStatus) => setFieldStatuses((currValue) => {
        const result = {...currValue};
        result[name] = value;
        return result;
    });

    function submitHandler(e: React.SyntheticEvent) {
        e.preventDefault();             
        setSubmitted(true);
        setServerErrors({});
        if (!hasError) {
            const errors = sendFormData(fieldStatuses);
            if (!errors)
                return; 
            setServerErrors(errors);
            for (const key in errors) {
                fieldStatuses[key].removeDirty();
            }
        }
    }

    return (
        <form className="auth-form" onSubmit={submitHandler} onChange={() => setSubmitted(false)}>
            <LinkSwitcher activeTab={activeTab} tabs={tabs}></LinkSwitcher>
            <div className="auth-content">
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
            </div>
            <div className="submit-button-box">
                <SubmitButton disabled={hasError && isSubmitted} 
                    classes={["button--primary", hasError && isSubmitted ? "button--red" : "button--green"]}
                >
                    Войти 
                </SubmitButton>
            </div>
        </form>
    );
}
