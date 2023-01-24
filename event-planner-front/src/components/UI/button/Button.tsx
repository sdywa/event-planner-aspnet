import { FC } from "react";
import { Link } from "react-router-dom";

export interface IButtonProps {
    link?: string;
    classes?: string[];
    children: React.ReactNode;
    [props:string]: any;
};

export const Button: FC<IButtonProps> = ({ children, link="#", classes=[], ...props }) => {
    return (
        <Link className={[ "button", ...classes ].join(" ") } to={ link } {...props}>
            { children }
        </Link>
    );
}
