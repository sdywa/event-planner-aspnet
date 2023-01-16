import { FC } from "react";
import { Outlet } from "react-router-dom";
import { Logo, LogoTypes } from "../UI/logo/Logo";
import "./AuthLayout.css";

export const AuthLayout: FC = (props) => {
    return (
        <>
            <section className="section-auth">
                <div className="auth-inner">
                    <Logo logoType={LogoTypes.FULL_LOGO} />
                    <Outlet/>
                </div>
            </section>
        </>
    );
}
