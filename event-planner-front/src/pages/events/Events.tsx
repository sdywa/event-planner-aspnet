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
import EventService from "../../api/services/EventService";

const Events: FC = () => {
    const {user} = useContext(Context);
    const [events, setEvents] = useState<IEventResponse[]>([]);
    const {filteredItems, toggleFilter} = useFilter<IEventResponse>(events);
    const [showingFilter, setShowingFilter] = useState(false);

    function setFavorite(eventId: number, value: boolean) {
        EventService.setFavorite(eventId, {isFavorite: value})
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
                const events = await EventService.getAll();
                setEvents(events.data);
            } catch (e) {
                return;
            }
        } 

        getEvents();
    }, []);

    return (
        <PageLayout title="Мероприятия" header={
            <div className="w-full flex justify-between items-center ml-10">
                <EventSearch isAuth={user.isAuth} searchUrl={""} events={events} showingFilterCallback={setShowingFilter} filtersCallback={toggleFilter} />
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
                showingFilter && <EventFilter filtersCallback={toggleFilter} /> 
            }
            {
                filteredItems.length
                ?
                <div className="grid grid-cols-3 gap-y-8 gap-x-6 justify-items-center content-center">
                    {
                        filteredItems.map((v) => <EventTile key={v.id} isAuth={user.isAuth} event={v} favoriteCallback={(value: boolean) => setFavorite(v.id, value)} />)
                    }
                </div>
                :
                <EmptyPlaceholder text="Мероприятия не найдены" />
            }
        </PageLayout>
    );
}

export default observer(Events);
