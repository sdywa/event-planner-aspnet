import React, { FC } from "react";
import { LinkSwitcher } from "../link-swticher/LinkSwitcher";
import { SubmitButton } from '../button/SubmitButton';
import "./AuthForm.css";

export interface IAuthFormProps {
    selectedTabIndex: 0 | 1;
    children: React.ReactNode;
    hasError: boolean;
    isSubmitted: boolean;
    onSubmit: (e: React.SyntheticEvent) => void;
};

export const AuthForm: FC<IAuthFormProps> = ({selectedTabIndex, children, hasError, isSubmitted, onSubmit}) => {
    const tabs = [{title: "Вход", link: "/login"}, {title: "Регистрация", link: "/signup"}];
    const activeTab = tabs[selectedTabIndex].title;

    return (
        <form className="auth-form" onSubmit={onSubmit}>
            <LinkSwitcher activeTab={activeTab} tabs={tabs}></LinkSwitcher>
            <div className="auth-content">
                {children}
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
