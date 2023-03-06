import { FC } from "react";
import { IFilter } from "../../../../types";
import { IEventResponse } from "../../../../types/Api";

interface IEventFilterProps {
    filtersCallback: (value: IFilter<IEventResponse>) => void;
    [props:string]: any 
};

export const EventFilter: FC<IEventFilterProps> = ({filtersCallback, ...props}) => {
    return (
        <div {...props}>
            filter
        </div>
    );
}
