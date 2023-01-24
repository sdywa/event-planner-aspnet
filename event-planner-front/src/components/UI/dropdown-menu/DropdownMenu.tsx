import { FC } from "react";
import { DropdownMenuItem } from "./DropdownMenuItem";

interface IDropdownMenuProps {
    children: React.ReactNode;
    items: {label: string, link: string, icon?: string}[];
};

export const DropdownMenu: FC<IDropdownMenuProps> = ({children, items}) => {
    return (
        <div className="relative group">
            {children}
            <ul className="absolute left-auto right-0 top-full flex justify-center items-center flex-col w-36 py-1 px-3 bg-white rounded-lg shadow-md invisible opacity-0 scale-95 -translate-y-1 origin-top transition-all duration-100 ease-in group-hover:visible group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0">
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
