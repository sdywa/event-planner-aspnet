import { FC } from "react";
import { Link } from "react-router-dom";
import { IEvent } from "../../../../types";
import { Bookmark } from "../../bookmark/Bookmark";
import { Location } from "../location/Location";

interface IEventTileProps {
    event: IEvent;
    favoriteCallback: (value: boolean) => void;
};

export const EventTile: FC<IEventTileProps> = ({event, favoriteCallback}) => {  
    return (
        <Link to={`/events/${event.id}`}
            className="flex flex-col max-w-[21.5rem] font-roboto text-base text-black"
        >
            <div className="w-full h-44 relative bg-lightgray rounded-t-xl">
                {
                    event.coverUrl && <img src={event.coverUrl} alt={event.title} />
                }
                <Bookmark isFavorite={event.isFavorite} className={"absolute top-4 right-4 text-2xl"} favoriteCallback={favoriteCallback} />
            </div>
            <div className="flex flex-col gap-1 h-[11.5rem] py-4 px-3">
                <div className="flex flex-col">
                    <div className="flex justify-between items-center text-sm font-light">
                        <div>{event.category}</div>
                        <div>{event.date}</div>
                    </div>
                    <div className="max-w-full w-[18.5rem] overflow-hidden text-ellipsis font-ubuntu text-xl font-bold whitespace-nowrap">
                        {event.title}
                    </div>
                </div>
                <div className="max-w-full overflow-hidden text-ellipsis two-lines">
                    {event.description}
                </div>
                <div className="flex justify-between items-center flex-wrap">
                    <Location type={event.type} location={event.location} />
                    <div className="font-bold">
                        {
                            event.minPrice 
                            ?
                            `от ${event.minPrice} руб.`
                            :
                            "Бесплатно"
                        }
                    </div>
                </div>
            </div>
        </Link>
    );
}
