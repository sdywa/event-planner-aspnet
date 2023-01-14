import { FC } from "react";
import { Link } from "react-router-dom";

export interface IButtonProps {
    link: string;
    children: React.ReactNode;
    classes?: string[];
};

export const Button: FC<IButtonProps> = ({ children, link, classes }) => {
    return (
        <Link className={ ["button", ...(classes || [])].join(' ') } to={ link }>
            { children }
        </Link>
    );
}
