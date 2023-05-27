import React, { FC } from "react";
import clsx from "clsx";

interface IDraggableItemProps {
    className?: string | string[];
    children: React.ReactNode;
}

export const DraggableItem: FC<IDraggableItemProps> = ({
    className,
    children,
}) => {
    return (
        <div className={clsx("flex items-center gap-3 px-3 py-2", className)}>
            <div className="flex flex-col gap-[2px] w-3">
                <div className="bg-lightgray h-[2px] rounded-lg"></div>
                <div className="bg-lightgray h-[2px] rounded-lg"></div>
                <div className="bg-lightgray h-[2px] rounded-lg"></div>
            </div>
            {children}
        </div>
    );
};
