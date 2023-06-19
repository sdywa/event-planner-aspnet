import React, { FC } from "react";

import { WithIcon } from "../WithIcon";

interface ILocationProps {
    type?: number;
    location?: string;
}

export const Location: FC<ILocationProps> = ({ type = 0, location }) => {
    return (
        <>
            {type === 0 ? (
                <WithIcon icon={<i className="fa-solid fa-location-dot" />}>
                    {location}
                </WithIcon>
            ) : (
                <WithIcon icon={<i className="fa-solid fa-link" />}>
                    Онлайн
                </WithIcon>
            )}
        </>
    );
};
