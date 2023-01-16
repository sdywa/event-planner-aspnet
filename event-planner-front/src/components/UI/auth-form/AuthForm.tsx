import { FC } from "react";
import { LinkSwitcher } from "../link-swticher/LinkSwitcher";
import { SubmitButton } from '../button/SubmitButton';
import "./AuthForm.css";

export interface IAuthFormProps {
    selectedTabIndex: 0 | 1;
    children: React.ReactNode;
};

export const AuthForm: FC<IAuthFormProps> = ({selectedTabIndex, children}) => {
    const tabs = [{title: "Вход", link: "/login"}, {title: "Регистрация", link: "/signup"}];
    const activeTab = tabs[selectedTabIndex].title;

    return (
        <form className="auth-form">
            <LinkSwitcher activeTab={activeTab} tabs={tabs}></LinkSwitcher>
            <div className="auth-content">
                {children}
            </div>
            <div className="submit-button-box">
                <SubmitButton classes={["button--primary button--green"]}>
                    Войти
                </SubmitButton>
            </div>
        </form>
    );
}
