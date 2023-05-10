import { FC } from "react";
import { Status } from "../../types/Api";
import clsx from "clsx";

interface IStatusProps {
    status: Status,
    titles: {
        [key in Status]: any
    }
};

export const StatusIcon: FC<IStatusProps> = ({ status, titles }) => {
    const colors: { [key in Status]: any } = {
        [Status.Active]: "green",
        [Status.Waiting]: "yellow",
        [Status.Closed]: "blue"
    }

    return (
        <div className="flex gap-2 items-center">
            <div className={clsx(["w-3 h-3 rounded-full", `bg-${colors[status as Status]}`])}></div>
            <span>{titles[status]}</span>
        </div>
    );
}
