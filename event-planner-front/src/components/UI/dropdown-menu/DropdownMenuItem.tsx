import { FC } from "react";
import { Link } from "react-router-dom";
import { WithIcon } from "../with-icon/WithIcon";

interface IDropdownMenuItemProps {
    label: string;
    link: string;
    icon?: React.ReactNode;
};

export const DropdownMenuItem: FC<IDropdownMenuItemProps> = ({label, link, icon}) => {
    return (
        <li className="w-full p-2 border-b-[1px] border-lightgray last:border-none">
            <Link to={link} className="flex justify-start items-center gap-2 text-darkgray font-ubuntu text-base font-medium transition-colors duration-300 hover:text-gray">
                <WithIcon icon={icon}>
                    {label}
                </WithIcon>    
            </Link>
        </li>
    );
}
