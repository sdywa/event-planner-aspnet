import { FC } from "react";
import { Link } from "react-router-dom";
import "./Button.css";

export interface IButtonProps {
    link?: string;
    classes?: string[];
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

export const Button: FC<IButtonProps> = ({ children, link="#", onClick, classes=[] }) => {
    return (
        <Link onClick={ onClick } className={[ "button", ...classes ].join(" ") } to={ link }>
            { children }
        </Link>
    );
}
