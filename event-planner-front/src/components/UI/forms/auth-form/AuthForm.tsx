import { FC } from "react";
import { LinkSwitcher } from "../../link-swticher/LinkSwitcher";
import { SubmitButton } from '../../button/SubmitButton';
import { FormInput } from "../form-input/FormInput";
import { IServerError, IFormInputStatus, IFormInputData } from "../../../../types";
import { ButtonStyles } from "../../button/Button";
import useForm from "../../../../hooks/forms/useForm";

export interface IAuthFormProps {
    selectedTabIndex: 0 | 1;
    data: { [key: string]: IFormInputData };
    sendFormData: (data: {[key: string]: IFormInputStatus}) => IServerError;
};

export const AuthForm: FC<IAuthFormProps> = ({selectedTabIndex, data, sendFormData}) => {
    const tabs = [{title: "Вход", link: "/login"}, {title: "Регистрация", link: "/signup"}];
    const activeTab = tabs[selectedTabIndex].title;
    const {serverErrors, isSubmitted, updateFieldStatuses, onChange, onSubmit, hasError} = useForm(sendFormData);

    return (
        <form className="flex flex-col justify-center items-center gap-6 w-[26rem] bg-white rounded-lg p-10 shadow-lg" onSubmit={onSubmit} onChange={onChange}>
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
                <SubmitButton disabled={hasError} isPrimary={true} 
                    buttonStyle={hasError ? ButtonStyles.BUTTON_RED : ButtonStyles.BUTTON_GREEN}>
                    Войти 
                </SubmitButton>
            </div>
        </form>
    );
}
