import { FC, useState } from "react";
import { PageLayout } from "../../components/layouts/page-layout/PageLayout";
import { Button, ButtonStyles } from "../../components/UI/button/Button";
import { EventTile } from "../../components/UI/events/event-tile/EventTile";
import { EventSearch } from "../../components/UI/events/event-search/EventSearch";
import { EventFilter } from "../../components/UI/events/event-filter/EventFilter";
import { IUserEvent } from "../../types";
import { WithIcon } from "../../components/UI/with-icon/WithIcon";
import useFilter from "../../hooks/useFilter";
import { EmptyPlaceholder } from "../../components/UI/empty-placeholder/EmptyPlaceholder";

export const Events: FC = () => {
    const isAuth = true;
    const isCreator = true;
    const [events, setEvents] = useState<IUserEvent[]>([{
        id: 1,
        title: "Заголовок",
        cover: "",
        description: "Описание мероприятия описание описание описание описание",
        category: {
            id: 1,
            title: "Бизнес"
        },
        type: {
            id: 1,
            title: "Оффлайн"
        },
        startDate: "2023-12-12T15:00:00.000Z",
        address: "г. Москва",
        minPrice: 0,
        isFavorite: false
    },
    {
        id: 2,
        title: "Очень очень длинный заголовок который не помещается",
        cover: "",
        description: "Очень длинное название которое тоже не помещается в этот маленький блок что я не знаю что с ним делать",
        category: {
            id: 1,
            title: "Искусство и культура"
        },
        type: {
            id: 1,
            title: "Оффлайн"
        },
        startDate: "2024-12-12T15:00:00.000Z",
        address: "г. Кременчуг-Константиновское",
        minPrice: 99999,
        isFavorite: true
    },
    {
        id: 3,
        title: "Заголовок",
        cover: "",
        description: "Описание мероприятия описание описание описание описание",
        category: {
            id: 1,
            title: "Бизнес"
        },
        type: {
            id: 2,
            title: "Онлайн"
        },
        startDate: "2023-12-12T15:00:00.000Z",
        minPrice: 0,
        isFavorite: false
    },
    {
        id: 4,
        title: "Заголовок",
        cover: "",
        description: "Описание мероприятия описание описание описание описание",
        category: {
            id: 1,
            title: "Бизнес"
        },
        type: {
            id: 2,
            title: "Онлайн"
        },
        startDate: "2023-12-12T15:00:00.000Z",
        minPrice: 0,
        isFavorite: false
    }]);
    const {filteredItems, toggleFilter} = useFilter<IUserEvent>(events);
    const [showingFilter, setShowingFilter] = useState(false);

    function setFavorite(eventId: number, value: boolean) {
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

    return (
        <PageLayout title="Мероприятия" header={
            <div className="w-full flex justify-between items-center ml-10">
                <EventSearch isAuth={isAuth} searchUrl={""} events={events} showingFilterCallback={setShowingFilter} filtersCallback={toggleFilter} />
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
                <div className="grid grid-cols-3 gap-y-8 gap-x-6 justify-items-center content-center">
                    {
                        filteredItems.map((v) => <EventTile key={v.id} event={v} favoriteCallback={(value: boolean) => setFavorite(v.id, value)} />)
                    }
                </div>
                :
                <EmptyPlaceholder text="Мероприятия не найдены" />
            }
        </PageLayout>
    );
}
