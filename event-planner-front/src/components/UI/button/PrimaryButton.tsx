import React, { FC } from "react";
import { Button, IButtonProps } from "./Button";
import "./Button.css";

export const PrimaryButton: FC<IButtonProps> = ({ children, link, classes }) => {
    return (
        <Button classes={ ["button--primary", ...(classes || [])] } link={link}>
            { children }
        </Button>
    );
}
