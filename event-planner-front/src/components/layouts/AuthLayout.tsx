import React, { FC } from "react";
import { Outlet } from "react-router-dom";

import { Logo, LogoTypes } from "../UI/Logo";

export const AuthLayout: FC = () => {
    return (
        <section className="flex justify-center pt-8">
            <div className="flex flex-col justify-center items-center gap-8 mb-16">
                <Logo logoType={LogoTypes.FULL_LOGO} />
                <Outlet />
            </div>
        </section>
    );
};
