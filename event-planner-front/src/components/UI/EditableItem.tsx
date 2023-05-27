import React, { FC } from "react";
import clsx from "clsx";

interface IEditableItemProps {
    isActive: boolean;
    activeState: React.ReactNode;
    defaultState: React.ReactNode;
    showButtons?: boolean;
    open: () => void;
    close: () => void;
    remove: () => void;
}

export const EditableItem: FC<IEditableItemProps> = ({
    isActive,
    activeState,
    defaultState,
    open,
    close,
    remove,
    showButtons = true,
}) => {
    return (
        <div className="w-full">
            <div
                className={clsx([
                    "flex justify-between items-center gap-2 w-full",
                    isActive ? "flex" : "hidden",
                ])}
            >
                {activeState}
                <div className="flex items-center gap-2">
                    <i
                        className="fa-solid fa-check text-green text-xl cursor-pointer"
                        onClick={() => close()}
                    ></i>
                </div>
            </div>
            <div
                className={clsx([
                    "flex justify-between items-center gap-2 w-full",
                    !isActive ? "flex" : "hidden",
                ])}
            >
                {defaultState}
                {showButtons && (
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ease-in duration-200">
                        <i
                            className="fa-solid fa-pen text-lg cursor-pointer"
                            onClick={() => open()}
                        ></i>
                        <i
                            className="fa-solid fa-xmark text-red text-2xl cursor-pointer"
                            onClick={() => remove()}
                        ></i>
                    </div>
                )}
            </div>
        </div>
    );
};
