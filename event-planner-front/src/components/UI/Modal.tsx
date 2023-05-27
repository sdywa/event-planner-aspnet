import React, { FC, useEffect } from "react";
import { clsx } from "clsx";

interface IModalProps {
    active: boolean;
    setActive: (value: boolean) => void;
    children: React.ReactNode;
}

export const Modal: FC<IModalProps> = ({ active, setActive, children }) => {
    useEffect(() => {
        if (active) document.body.classList.add("overflow-hidden");
        else document.body.classList.remove("overflow-hidden");
    }, [active]);

    return (
        <div
            className={clsx(
                "h-screen w-screen bg-[rgba(0,0,0,0.4)] fixed inset-0 z-[99999] flex justify-center items-center ease-in duration-100",
                active
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
            )}
            onClick={() => setActive(false)}
        >
            <div
                className={clsx(
                    "py-6 px-12 bg-white w-fit h-fit rounded-xl shadow-xl ease-in duration-75",
                    active
                        ? "translate-y-0 scale-100"
                        : "-translate-y-1 scale-95"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};
