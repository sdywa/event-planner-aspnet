import { FC } from "react";
import { clsx } from "clsx";
import { Link } from "react-router-dom";

export enum ButtonStyles {
    BUTTON_GREEN = "button--green",
    BUTTON_RED = "button--red"
}

export interface IButtonProps {
    children: React.ReactNode;
    link?: string;
    isPrimary?: boolean;
    buttonStyle?: ButtonStyles;
    className?: string[];
    [props:string]: any;
};

export const Button: FC<IButtonProps> = ({ children, link="#", isPrimary, buttonStyle, className, ...props }) => {
    return (
        <Link className={clsx(["button", isPrimary && "button--primary", buttonStyle, className])} to={ link } {...props}>
            { children }
        </Link>
    );
}
