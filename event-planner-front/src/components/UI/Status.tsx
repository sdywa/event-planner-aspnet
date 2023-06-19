import React, { FC } from "react";
import clsx from "clsx";

import { Status } from "../../types/Api";

interface IStatusProps {
    status: Status;
    titles: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key in Status]: any;
    };
}

export const StatusIcon: FC<IStatusProps> = ({ status, titles }) => {
    const colors: { [key in Status]: unknown } = {
        [Status.Active]: "green",
        [Status.Waiting]: "yellow",
        [Status.Closed]: "blue",
    };

    return (
        <div className="flex gap-2 items-center">
            <div
                className={clsx([
                    "w-3 h-3 rounded-full",
                    `bg-${colors[status as Status]}`,
                ])}
            ></div>
            <span>{titles[status]}</span>
        </div>
    );
};
