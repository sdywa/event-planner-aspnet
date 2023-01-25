import React, { FC, useState } from "react";
import { clsx } from "clsx";
import { Link } from "react-router-dom";

interface IEventTileProps {
    id: number;
    title: string;
    coverUrl?: string;
    description: string;
    category: string;
    type: string;
    date: string;
    location?: string;
    minPrice: number;
    isFavorite: boolean;
};

export const EventTile: FC<IEventTileProps> = ({id, title, coverUrl="", category, type, date, description, minPrice, location="", isFavorite}) => {
    const [isBookmarked, setBookmark] = useState(isFavorite);

    function onClick(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        setBookmark(!isBookmarked);
    }
    
    return (
        <Link to={`/events/${id}`}
            className="flex flex-col max-w-[21.5rem] font-roboto text-base text-black"
        >
            <div className="w-full h-44 relative bg-lightgray rounded-t-xl">
                {
                    coverUrl && <img src={coverUrl} alt={title} />
                }
                <div onClick={onClick} 
                    className={clsx(["bookmark", isBookmarked && "bookmark--active"])}>
                    <i className="fa-solid fa-bookmark"></i>
                </div>
            </div>
            <div className="flex flex-col gap-1 h-[11.5rem] py-4 px-3">
                <div className="flex flex-col">
                    <div className="flex justify-between items-center text-sm font-light">
                        <div>{category}</div>
                        <div>{date}</div>
                    </div>
                    <div className="max-w-full overflow-hidden text-ellipsis font-ubuntu text-xl font-bold whitespace-nowrap">
                        {title}
                    </div>
                </div>
                <div className="max-w-full overflow-hidden text-ellipsis two-lines">
                    {description}
                </div>
                <div className="flex justify-between items-center flex-wrap">
                    {
                        type === "Offline"
                        ?
                        <span>
                            <i className="fa-solid fa-location-dot"></i> {location}
                        </span>
                        :
                        <span>
                            <i className="fa-solid fa-link"></i> Онлайн
                        </span>
                    }
                    <div className="font-bold">
                        {
                            minPrice 
                            ?
                            `от ${minPrice} руб.`
                            :
                            "Бесплатно"
                        }
                    </div>
                </div>
            </div>
        </Link>
    );
}
