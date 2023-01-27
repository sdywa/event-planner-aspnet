import { FC } from "react";
import { WithIcon } from "../../with-icon/WithIcon";

interface ILocationProps {
    type: string;
    location?: string;
};

export const Location: FC<ILocationProps> = ({type, location}) => {
    return (
        <>
            {
                type === "Offline"
                ?
                    <WithIcon icon={<i className="fa-solid fa-location-dot" />}>
                        {location}
                    </WithIcon>
                :
                    <WithIcon icon={<i className="fa-solid fa-link" />}>
                        Онлайн
                    </WithIcon>
            }
        </>
    );
}
