import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import "./EventTile.css";

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
            className="event-tile flex flex--centered"
        >
            <div className="event-cover">
                {
                    coverUrl
                    ?
                    <img src={coverUrl} alt={title} />
                    :
                    <></>
                }
                <div onClick={onClick}
                    className={["event-bookmark", isBookmarked ? "event-bookmark--active" : ""].filter(x => x).join(" ")}
                >
                    <i className="fa-solid fa-bookmark"></i>
                </div>
            </div>
            <div className="event-info flex">
                <div className="event-info-main flex">
                    <div className="event-info-secondary flex">
                        <div className="event-category">{category}</div>
                        <div className="event-date">{date}</div>
                    </div>
                    <div className="event-title">
                        {title}
                    </div>
                </div>
                <div className="event-description">
                    {description}
                </div>
                <div className="event-info-additional flex">
                    {
                        type === "Offline"
                        ?
                        <span className="event-location">
                            <i className="fa-solid fa-location-dot"></i> {location}
                        </span>
                        :
                        <span className="event-location">
                            <i className="fa-solid fa-link"></i> Онлайн
                        </span>
                    }
                    <div className="event-price">
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
