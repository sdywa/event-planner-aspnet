import { FC } from "react";
import { IStatus } from "../../types/Api";
import clsx from "clsx";

interface IStatusProps {
    status: IStatus,
    titles: {
        [key in IStatus]: any
    }
};

export const Status: FC<IStatusProps> = ({ status, titles }) => {
    const colors: { [key in IStatus]: any } = {
        [IStatus.active]: "green",
        [IStatus.waiting]: "yellow",
        [IStatus.closed]: "blue"
    }

    return (
        <div className="flex gap-2 items-center">
            <div className={clsx(["w-3 h-3 rounded-full", `bg-${colors[status]}`])}></div>
            <span>{titles[status]}</span>
        </div>
    );
}
