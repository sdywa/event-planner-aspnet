import { FC } from "react";
import { Link } from "react-router-dom";
import { IEventResponse } from "../../../../types/Api";
import { Bookmark } from "../../bookmark/Bookmark";
import { Location } from "../location/Location";
import clsx from "clsx";

interface IEventTileProps {
    isAuth: Boolean;
    minPrice?: number;
    event: IEventResponse;
    favoriteCallback?: (value: boolean) => void;
    className?: string | string[]
};

export const EventTile: FC<IEventTileProps> = ({isAuth, minPrice, event, className, favoriteCallback=null}) => {
    function parseDate(date: Date) {
        const currentYear = new Date().getFullYear();
        const options: Intl.DateTimeFormatOptions = {
            day: "numeric",
            month: "long",
            year: currentYear !== date.getFullYear() ? "numeric" : undefined
        }
        return date.toLocaleDateString("ru-RU", options);
    }

    function getAddress() {
        let address = event.address?.full.split(", ");
        if (!address)
            return "";
        return address.splice(0, address.length - 2).join(", ");
    }

    return (
        <Link to={`/events/${event.id}`}
            className={clsx([className, "flex flex-col max-w-[21.5rem] font-roboto text-base text-black shadow-lg rounded-xl"])}
        >
            {
                event.cover &&
                <div className="w-full h-44 relative bg-lightgray rounded-t-xl overflow-hidden">
                    {
                        event.cover && <img src={"data:image/png;base64," + event.cover} className="absolute -translate-y-1/2 top-1/2 w-full" alt={event.title} />
                    }
                    {
                        isAuth && favoriteCallback && <Bookmark isFavorite={event.isFavorite} className={"absolute top-4 right-4 text-2xl"} favoriteCallback={favoriteCallback} />
                    }
                </div>
            }
            <div className="flex flex-col gap-1 max-h-[11.5rem] py-4 px-3">
                <div className="flex flex-col">
                    <div className="flex justify-between items-center text-sm font-light">
                        <div>{event.category.title}</div>
                        {
                            event.startDate &&
                            <div>{parseDate(new Date(event.startDate))}</div>
                        }
                    </div>
                    <div className="max-w-full w-[18.5rem] overflow-hidden text-ellipsis font-ubuntu text-xl font-bold whitespace-nowrap">
                        {event.title}
                    </div>
                </div>
                <div className="max-w-full overflow-hidden text-ellipsis two-lines break-words">
                    {event.description}
                </div>
                <div className="flex justify-between items-center flex-wrap">
                    <Location type={event.type.id} location={getAddress()} />
                    {
                        minPrice !== undefined &&
                            <div className="font-bold">
                            {
                                minPrice
                                ?
                                `от ${minPrice} руб.`
                                :
                                "Бесплатно"
                            }
                            </div>
                    }
                </div>
            </div>
        </Link>
    );
}
