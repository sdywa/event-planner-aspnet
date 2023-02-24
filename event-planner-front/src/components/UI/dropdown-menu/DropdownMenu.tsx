import React, { FC } from "react";
import { List } from "../list/List";
import { SimpleListItem } from "../list/SimpleListItem";

interface IDropdownMenuProps {
    children: React.ReactNode;
    items: {label: string, link?: string, icon?: React.ReactNode, onClick?: (e: React.MouseEvent<HTMLLIElement>) => void}[];
};

export const DropdownMenu: FC<IDropdownMenuProps> = ({children, items}) => {
    return (
        <div className="relative group w-fit">
            {children}
            <div className="absolute left-auto right-0 top-full z-50 flex justify-center items-center flex-col w-36 py-1 px-3 bg-white rounded-lg shadow-md invisible opacity-0 scale-95 -translate-y-1 origin-top transition-all duration-100 ease-in group-hover:visible group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0">
                <List>
                    {
                        items.map((item, index) =>
                            <SimpleListItem 
                                key={index} 
                                label={item.label} 
                                link={item.link} 
                                icon={item.icon}
                                onClick={item.onClick}
                                className="text-darkgray hover:text-gray"
                            ></SimpleListItem>
                        )
                    }
                </List>
            </div>
        </div>
    );
}
