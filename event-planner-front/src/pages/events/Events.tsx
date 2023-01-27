import { FC, useState } from "react";
import { PageLayout } from "../../components/layouts/page-layout/PageLayout";
import { Button, ButtonStyles } from "../../components/UI/button/Button";
import { EventTile } from "../../components/UI/events/event-tile/EventTile";
import { EventSearch } from "../../components/UI/events/event-search/EventSearch";
import { EventFilter } from "../../components/UI/events/event-filter/EventFilter";
import { IEvent } from "../../types";
import { WithIcon } from "../../components/UI/with-icon/WithIcon";
import useFilter from "../../hooks/useFilter";
import { EmptyPlaceholder } from "../../components/UI/empty-placeholder/EmptyPlaceholder";

export const Events: FC = () => {
    const [events, setEvents] = useState<IEvent[]>([{
        id: 1,
        title: "Заголовок",
        coverUrl: "",
        description: "Описание мероприятия описание описание описание описание",
        category: "Бизнес",
        type: "Offline",
        date: "12 декабря",
        location: "г. Москва",
        minPrice: 0,
        isFavorite: false
    },
    {
        id: 2,
        title: "Очень очень длинный заголовок который не помещается",
        coverUrl: "",
        description: "Очень длинное название которое тоже не помещается в этот маленький блок что я не знаю что с ним делать",
        category: "Искусство и культура",
        type: "Offline",
        date: "12 сентября, 2024 г.",
        location: "г. Кременчуг-Константиновское",
        minPrice: 99999,
        isFavorite: true
    },
    {
        id: 3,
        title: "Заголовок",
        coverUrl: "",
        description: "Описание мероприятия описание описание описание описание",
        category: "Бизнес",
        type: "Online",
        date: "12 декабря",
        minPrice: 0,
        isFavorite: false
    },
    {
        id: 4,
        title: "Заголовок",
        coverUrl: "",
        description: "Описание мероприятия описание описание описание описание",
        category: "Бизнес",
        type: "Online",
        date: "12 декабря",
        minPrice: 0,
        isFavorite: false
    }]);
    const {filteredItems, toggleFilter} = useFilter<IEvent>(events);
    const [showingFilter, setShowingFilter] = useState(false);
    const isCreator = true;

    function toggleFavorite(eventId: number) {
        const nextEvents = events.map((event) => {
            if (event.id === eventId) {
                console.log(event.id);
                return {
                    ...event,
                    isFavorite: !event.isFavorite
                };
            }
            return event;
        });
        setEvents(nextEvents);
    }

    return (
        <PageLayout title="Мероприятия" header={
            <div className="w-full flex justify-between items-center ml-10">
                <EventSearch searchUrl={""} events={events} showingFilterCallback={setShowingFilter} filtersCallback={toggleFilter} />
                { 
                    isCreator && 
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
                <div className="grid grid-cols-3 gap-y-4 gap-x-6 justify-items-center content-center">
                    {
                        filteredItems.map((v) => <EventTile key={v.id} event={v} favoriteCallback={toggleFavorite} />)
                    }
                </div>
                :
                <EmptyPlaceholder text="Мероприятия не найдены" />
            }
        </PageLayout>
    );
}
