import { FC } from "react";
import { clsx } from "clsx";
import { Link } from "react-router-dom";

export enum ButtonStyles {
    BUTTON_GREEN = "green",
    BUTTON_RED = "red",
    BUTTON_BLUE = "blue",
    BUTTON_GRAY = "gray"
}

export const getStyles = (isPrimary: boolean, style?: ButtonStyles): string => {
    let result = "inline-block px-3 bg-transparent font-ubuntu text-sm text-center font-bold cursor-pointer transition-all duration-300 ease-in";
    if (isPrimary)
        result += " py-2 px-5 border-2 rounded-md";

    if (style) {
        result += ` text-${style} border-${style} hover:border-dark${style}`;
        if (isPrimary)
            return `${result} hover:text-white hover:bg-${style}`;
        result += ` hover:text-dark${style}`;
    } else {
        result += " text-black hover:text-darkgray";
        if (isPrimary)
            return `${result} border-black hover:border-darkgray`;
    }
    return result;
}

export interface IButtonProps {
    children: React.ReactNode;
    link?: string;
    isPrimary?: boolean;
    buttonStyle?: ButtonStyles;
    className?: string | string[];
    [props:string]: any;
};

export const Button: FC<IButtonProps> = ({children, link="#", buttonStyle, className, isPrimary=false, ...props}) => {
    return (
        <Link className={clsx([getStyles(isPrimary, buttonStyle), className])} to={ link } {...props}>
            { children }
        </Link>
    );
}
