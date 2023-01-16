import { FC } from "react";
import { useNavigate } from "react-router-dom";
import "./Logo.css";

export enum LogoTypes {
    COMPACT_LOGO = "compact-logo.svg",
    FULL_LOGO = "full-logo.svg",
    LOGO = "logo.svg"
}

interface ILogoProps {
    logoType: LogoTypes
};

export const Logo: FC<ILogoProps> = ({logoType}) => {
    const navigate = useNavigate();

    return (
        <div className="logo" onClick={() => navigate("/")}>
            <img className="logo-inner" src={require(`../../../assets/img/logo/${logoType}`)} alt="Логотип" />
        </div>
    );
}
