import { FC } from "react";
import { IEvent, IFilter } from "../../../../types";

interface IEventFilterProps {
    filtersCallback: (value: IFilter<IEvent>) => void;
    [props:string]: any 
};

export const EventFilter: FC<IEventFilterProps> = ({filtersCallback, ...props}) => {
    return (
        <div {...props}>
            filter
        </div>
    );
}
