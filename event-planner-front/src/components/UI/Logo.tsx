import React, { FC } from "react";
import { Link } from "react-router-dom";

export enum LogoTypes {
    COMPACT_LOGO = "compact-logo.svg",
    FULL_LOGO = "full-logo.svg",
    LOGO = "logo.svg",
}

interface ILogoProps {
    logoType: LogoTypes;
}

export const Logo: FC<ILogoProps> = ({ logoType }) => {
    return (
        <Link to="/" className="cursor-pointer">
            <img
                src={require(`../../assets/img/logo/${logoType}`)}
                alt="Логотип"
            />
        </Link>
    );
};
