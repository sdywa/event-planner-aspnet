import React, { FC, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";

import { EventService } from "../api/services/EventService";
import { PageLayout } from "../components/layouts/PageLayout";
import { Button, ButtonStyles } from "../components/UI/buttons/Button";
import { EmptyPlaceholder } from "../components/UI/EmptyPlaceholder";
import { Filter } from "../components/UI/event/Filter";
import { Rating } from "../components/UI/event/Rating";
import { Search } from "../components/UI/event/Search";
import { Tile } from "../components/UI/event/Tile";
import { WithIcon } from "../components/UI/WithIcon";
import { useFilter } from "../hooks/useFilter";
import { useUser } from "../hooks/useUserContext";
import { IEventResponse } from "../types/Api";

interface IExtendedEventResponse extends IEventResponse {
    minPrice: number;
}

interface IEventListResponse {
    review?: IEventResponse;
    events: IExtendedEventResponse[];
}

export const Events: FC = observer(() => {
    const { user } = useUser();
    const [review, setReview] = useState<IEventResponse>();
    const [allEvents, setAllEvents] = useState<IExtendedEventResponse[]>([]);
    const [events, setEvents] = useState<IExtendedEventResponse[]>([]);
    const { filteredItems, toggleFilter } =
        useFilter<IExtendedEventResponse>(events);
    const [showingFilter, setShowingFilter] = useState(false);
    const [searchText, setSearchText] = useState("");

    function setFavorite(eventId: number, value: boolean) {
        EventService.setFavorite(eventId, { isFavorite: value });
        const nextEvents = events.map((event) => {
            if (event.id === eventId) {
                return {
                    ...event,
                    isFavorite: value,
                };
            }
            return event;
        });
        setEvents(nextEvents);
    }

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        const getEvents = async () => {
            try {
                const events = await EventService.getAll<IEventListResponse>();
                setReview(events.data.review);
                setEvents(events.data.events);
                setAllEvents(events.data.events);
            } catch (e) {
                return;
            }
        };

        getEvents();
    }, []);

    useEffect(() => {
        const searchEvents = async () => {
            const events = await EventService.search<IExtendedEventResponse>({
                search: searchText,
            });
            setEvents(events.data);
        };

        if (searchText) {
            searchEvents();
        } else {
            setEvents(allEvents);
        }
    }, [searchText]);

    const reviewCallback = (rating: number) => {
        if (review) EventService.makeReview(review.id, { rating: rating });
    };

    return (
        <PageLayout
            title="Мероприятия"
            header={
                <div className="w-full flex justify-between items-center ml-10">
                    <Search
                        isAuth={user.isAuth}
                        setSearchText={setSearchText}
                        showingFilterCallback={setShowingFilter}
                        filtersCallback={toggleFilter}
                    />
                    {user.isCreator && (
                        <Button
                            isPrimary={true}
                            buttonStyle={ButtonStyles.BUTTON_GREEN}
                            link="/events/new"
                        >
                            <WithIcon
                                icon={<i className="fa-solid fa-plus"></i>}
                            >
                                Добавить
                            </WithIcon>
                        </Button>
                    )}
                </div>
            }
        >
            {showingFilter && (
                <Filter className="px-6" filtersCallback={toggleFilter} />
            )}
            {review && (
                <div className="pb-8">
                    <Rating
                        event={review}
                        reviewCallback={reviewCallback}
                    ></Rating>
                </div>
            )}
            {filteredItems.length ? (
                <div className="grid grid-cols-3 gap-y-8 gap-x-6 justify-items-center content-center">
                    {filteredItems.map((v) => (
                        <Tile
                            key={v.id}
                            isAuth={user.isAuth}
                            minPrice={v.minPrice}
                            event={v}
                            favoriteCallback={(value: boolean) =>
                                setFavorite(v.id, value)
                            }
                        />
                    ))}
                </div>
            ) : (
                <EmptyPlaceholder text="Мероприятия не найдены" />
            )}
        </PageLayout>
    );
});
