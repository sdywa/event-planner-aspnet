import { FC, useState, useContext, useEffect } from "react";
import { PageLayout } from "../../components/layouts/page-layout/PageLayout";
import { Button, ButtonStyles } from "../../components/UI/button/Button";
import { EventTile } from "../../components/UI/events/event-tile/EventTile";
import { EventSearch } from "../../components/UI/events/event-search/EventSearch";
import { EventFilter } from "../../components/UI/events/event-filter/EventFilter";
import { IEventResponse } from "../../types/Api";
import { WithIcon } from "../../components/UI/with-icon/WithIcon";
import useFilter from "../../hooks/useFilter";
import { EmptyPlaceholder } from "../../components/UI/empty-placeholder/EmptyPlaceholder";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import { EventRating } from "../../components/UI/events/EventRating";
import EventService from "../../api/services/EventService";

interface IExtendedEventResponse extends IEventResponse {
    minPrice: number;
}

interface IEventListResponse {
    review?: IEventResponse;
    events: IExtendedEventResponse[]
}

const Events: FC = () => {
    const {user} = useContext(Context);
    const [review, setReview] = useState<IEventResponse>();
    const [allEvents, setAllEvents] = useState<IExtendedEventResponse[]>([]);
    const [events, setEvents] = useState<IExtendedEventResponse[]>([]);
    const {filteredItems, toggleFilter} = useFilter<IExtendedEventResponse>(events);
    const [showingFilter, setShowingFilter] = useState(false);
    const [searchText, setSearchText] = useState("");

    function setFavorite(eventId: number, value: boolean) {
        EventService.setFavorite(eventId, {isFavorite: value});
        const nextEvents = events.map((event) => {
            if (event.id === eventId) {
                return {
                    ...event,
                    isFavorite: value
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
        }

        getEvents();
    }, []);

    useEffect(() => {
        const searchEvents = async () => {
            const events = await EventService.search<IExtendedEventResponse>({search: searchText});
            setEvents(events.data);
        }

        if (searchText) {
            searchEvents();
        } else {
            setEvents(allEvents);
        }
    }, [searchText]);

    const reviewCallback = (rating: number) => {
        if (review)
            EventService.makeReview(review.id, {rating: rating});
    }

    return (
        <PageLayout title="Мероприятия" header={
            <div className="w-full flex justify-between items-center ml-10">
                <EventSearch isAuth={user.isAuth} setSearchText={setSearchText} showingFilterCallback={setShowingFilter} filtersCallback={toggleFilter} />
                {
                    user.isCreator &&
                    <Button isPrimary={true} buttonStyle={ButtonStyles.BUTTON_GREEN} link="/events/new">
                        <WithIcon icon={<i className="fa-solid fa-plus"></i>}>
                            Добавить
                        </WithIcon>
                    </Button>
                }
            </div>
        }>
            {
                showingFilter && <EventFilter className="px-6" filtersCallback={toggleFilter} />
            }
            { review &&
                <div className="pb-8">
                    <EventRating event={review} reviewCallback={reviewCallback}></EventRating>
                </div>
            }
            {
                filteredItems.length
                ?
                <div className="grid grid-cols-3 gap-y-8 gap-x-6 justify-items-center content-center">
                    {
                        filteredItems.map((v) => <EventTile key={v.id} isAuth={user.isAuth} minPrice={v.minPrice} event={v} favoriteCallback={(value: boolean) => setFavorite(v.id, value)} />)
                    }
                </div>
                :
                <EmptyPlaceholder text="Мероприятия не найдены" />
            }
        </PageLayout>
    );
}

export default observer(Events);
