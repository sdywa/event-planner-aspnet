import { FC } from "react";
import { Link } from "react-router-dom";
import { clsx } from "clsx";

interface IListItemProps {
    children: React.ReactNode;
    link?: string;
    className?: string | string[]; 
};

export const ListItem: FC<IListItemProps> = ({children, className, link="#"}) => {
    return (
        <li className="w-full p-2 border-b-[1px] border-lightgray last:border-none">
            <Link to={link} className={clsx("flex justify-start items-center gap-2 font-ubuntu text-base font-bold transition-colors duration-300", className)}>
                {children}   
            </Link>
        </li>
    );
}
