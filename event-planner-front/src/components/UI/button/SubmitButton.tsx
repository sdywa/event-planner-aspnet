import { FC } from "react";
import "./Button.css";

interface ISubmitButtonProps {
    classes?: string[];
    children: React.ReactNode;
    [props: string]: any;
};

export const SubmitButton: FC<ISubmitButtonProps> = ({children, classes=[], ...props}) => {
    return (
        <button type="submit" className={[ "button", ...classes ].join(" ") } {...props}>
            {children}
        </button>
    );
}
