import clsx from "clsx";
import React, { FC } from "react";

interface ISelectOptionProps {
    isActive: boolean;
    value: string;
    children: React.ReactNode;
    callBack: (v: string) => void;
};

export const SelectOption: FC<ISelectOptionProps> = ({isActive, value, children, callBack}) => {
    const onClick = (e: React.MouseEvent<HTMLLIElement>) => {
        e.stopPropagation();
        callBack(value);
    }

    return (
        <li className={clsx(`relative p-2 transition-all duration-150 font-medium rounded-md
        hover:text-green hover:bg-backgroundWhite
        before:content[''] before:w-3/4 before:h-[1px] before:bg-lightgray before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2`, isActive ? "text-green bg-backgroundWhite" : "text-darkgray")} onClick={onClick}>
            {children}
        </li>
    );
}
