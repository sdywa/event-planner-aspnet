import { FC } from "react";
import { clsx } from "clsx";

interface ISubmitButtonProps {
    classes?: string[];
    children: React.ReactNode;
    [props: string]: any;
};

export const SubmitButton: FC<ISubmitButtonProps> = ({children, classes=[], ...props}) => {
    return (
        <button type="submit" className={clsx(["button", classes])} {...props}>
            {children}
        </button>
    );
}
