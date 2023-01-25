import React, { FC, useState } from "react";
import { LinkSwitcher } from "../../link-swticher/LinkSwitcher";
import { SubmitButton } from '../../button/SubmitButton';
import { FormInput } from "../form-input/FormInput";
import { IServerError, IFieldStatus, IFormInputData } from "../../../../types";
import useFormErrors from "../../../../hooks/forms/useFormErrors";

export interface IAuthFormProps {
    selectedTabIndex: 0 | 1;
    data: { [key: string]: IFormInputData };
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
        <form className="flex flex-col justify-center items-center gap-6 w-[26rem] bg-white rounded-lg p-10 shadow-lg" onSubmit={submitHandler} onChange={() => setSubmitted(false)}>
            <LinkSwitcher activeTab={activeTab} tabs={tabs}></LinkSwitcher>
            <div className="flex flex-col justify-content items-center px-8 w-full">
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
            <div className="flex justify-end w-full px-8">
                <SubmitButton disabled={hasError && isSubmitted} isPrimary={true}
                    className={[ hasError && isSubmitted ? "button--red" : "button--green"]}
                >
                    Войти 
                </SubmitButton>
            </div>
        </form>
    );
}
