import React, { FC } from "react";
import clsx from "clsx";

import { Button, ButtonStyles } from "./Button";

interface IActionButtonProps {
    isShowing: boolean;
    children: React.ReactNode;
    [key: string]: unknown;
}

export const ActionButton: FC<IActionButtonProps> = ({
    isShowing,
    children,
    ...props
}) => {
    return (
        <Button
            className={clsx([
                "w-8 h-8 p-0 flex justify-center items-center text-lg border-2 rounded-md",
                !isShowing && "text-gray border-gray hover:border-darkgray",
            ])}
            buttonStyle={
                isShowing ? ButtonStyles.BUTTON_GREEN : ButtonStyles.BUTTON_GRAY
            }
            {...props}
        >
            {children}
        </Button>
    );
};
