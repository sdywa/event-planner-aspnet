import { FC } from "react";
import { clsx } from "clsx";
import { ButtonStyles } from "./Button";

interface ISubmitButtonProps {
    children: React.ReactNode;
    isPrimary?: boolean;
    buttonStyle?: ButtonStyles;
    className?: string[];
    [props: string]: any;
};

export const SubmitButton: FC<ISubmitButtonProps> = ({children, isPrimary, buttonStyle, className, ...props}) => {
    return (
        <button type="submit" className={clsx(["button", isPrimary && "button--primary", buttonStyle, className])} {...props}>
            {children}
        </button>
    );
}
