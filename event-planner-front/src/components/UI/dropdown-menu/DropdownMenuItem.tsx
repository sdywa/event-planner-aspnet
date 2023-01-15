import { FC } from "react";
import { Link } from "react-router-dom";
import "./DropdownMenuItem.css";

interface IDropdownMenuItemProps {
    label: string;
    link: string;
    icon?: string;
};

export const DropdownMenuItem: FC<IDropdownMenuItemProps> = ({label, link, icon=""}) => {
    return (
        <li className="dropdown-menu-item">
            <Link to={link} className="menu-item-inner">
                {
                    icon
                    ?
                    <div className="menu-item-icon"><i className={icon}></i></div>
                    :
                    null
                }
                <div className="menu-item-text">{label}</div>      
            </Link>
        </li>
    );
}
