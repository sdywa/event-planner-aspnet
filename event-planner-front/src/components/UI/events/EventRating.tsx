import React, { createRef, FC, useState } from "react";
import { Link } from "react-router-dom";
import { IEventResponse } from "../../../types/Api";

interface IEventRatingProps {
    event: IEventResponse;
    reviewCallback: (rating: number) => void;
};

export const EventRating: FC<IEventRatingProps> = ({event, reviewCallback}) => {
    const starCount = 5;
    const colorClass = "text-yellow";
    const starsRef = [...Array(starCount)].map(s => createRef<HTMLDivElement>());
    const [isClicked, setClicked] = useState(false);

    const getOnStarClick = (index: number) => {
        return (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            e.preventDefault();
            if (!isClicked)
                reviewCallback(index + 1);

            setClicked(true);
        }
    }

    const getOnStarHover = (index: number) => {
        return (e: React.MouseEvent<HTMLDivElement>) => {
            if (isClicked)
                return;

            for (let i = 0; i < starCount; i++) {
                if (i > index)
                    starsRef[i].current?.classList.remove(colorClass);
                else
                    starsRef[i].current?.classList.add(colorClass);
            }
        }
    }

    const onMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isClicked)
            return;

        for (let i = 0; i < starCount; i++) {
            starsRef[i].current?.classList.remove(colorClass);
        }
    }

    return (
        <Link to={`/events/${event.id}`} className="mx-auto flex justify-center items-center gap-6 w-[48rem]">
            <div className="w-80 h-44 relative bg-lightgray rounded-xl overflow-hidden">
                {
                    event.cover && <img src={"data:image/png;base64," + event.cover} className="absolute -translate-y-1/2 top-1/2 w-full" alt={event.title} />
                }
            </div>
            <div className="flex flex-col gap-1">
                <div className="font-ubuntu text-xl font-bold">
                    Понравилось ли вам мероприятие?
                </div>
                <div className="w-96 overflow-hidden text-ellipsis font-ubuntu text-lg font-medium whitespace-nowrap">
                    {event.title}
                </div>
                <div className="w-96 overflow-hidden text-ellipsis two-lines text-sm">
                    {event.description}
                </div>
                <div className="flex gap-1 text-3xl text-lightgray">
                    {
                        starsRef.map((ref, i) =>
                            <div ref={ref} key={i} className="transition-colors duration-150 ease-in" onClick={getOnStarClick(i)} onMouseEnter={getOnStarHover(i)} onMouseLeave={onMouseLeave}>
                                <i className="fa-solid fa-star"></i>
                            </div>)
                    }
                </div>
            </div>
        </Link>
    );
}
