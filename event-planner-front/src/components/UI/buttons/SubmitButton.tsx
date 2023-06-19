import React, { FC } from "react";
import { clsx } from "clsx";

import { ButtonStyles, getStyles } from "./Button";

interface ISubmitButtonProps {
    children: React.ReactNode;
    isPrimary?: boolean;
    buttonStyle?: ButtonStyles;
    className?: string[];
    [props: string]: unknown;
}

export const SubmitButton: FC<ISubmitButtonProps> = ({
    children,
    buttonStyle,
    className,
    isPrimary = false,
    ...props
}) => {
    return (
        <button
            type="submit"
            className={clsx([getStyles(isPrimary, buttonStyle), className])}
            {...props}
        >
            {children}
        </button>
    );
};
