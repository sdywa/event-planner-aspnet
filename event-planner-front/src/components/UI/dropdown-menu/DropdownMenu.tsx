import { FC } from "react";
import { DropdownMenuItem } from "./DropdownMenuItem";
import "./DropdownMenu.css"

interface IDropdownMenuProps {
    children: React.ReactNode;
    items: {label: string, link: string, icon?: string}[];
};

export const DropdownMenu: FC<IDropdownMenuProps> = ({children, items}) => {
    return (
        <div className="dropdown-menu-container">
            {children}
            <ul className="dropdown-menu flex flex--centered">
                {
                    items.map((item, index) =>
                        <DropdownMenuItem 
                            key={index} 
                            label={item.label} 
                            link={item.link} 
                            icon={item.icon}
                        ></DropdownMenuItem>
                    )
                }
            </ul>
        </div>
    );
}
