import { FC } from "react";
import { Outlet } from "react-router-dom";
import { Logo, LogoTypes } from "../../UI/logo/Logo";
import "./AuthLayout.css";

export const AuthLayout: FC = () => {
    return (
        <section className="section-auth flex">
            <div className="auth-inner flex flex--centered">
                <Logo logoType={LogoTypes.FULL_LOGO} />
                <Outlet/>
            </div>
        </section>
    );
}
