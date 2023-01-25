import { FC, useState } from "react";
import { PageLayout } from "../../components/layouts/page-layout/PageLayout";
import { Button, ButtonStyles } from "../../components/UI/button/Button";
import { EventTile } from "../../components/UI/event-tile/EventTile";
import { Search } from "../../components/UI/search/Search";

export const Events: FC = () => {
    const events = [{
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
    }];
    const isCreator = false;

    return (
        <PageLayout title="Мероприятия" header={
            <div className="w-full flex justify-between items-center">
                <Search searchUrl={""} />
                { 
                    isCreator && <Button isPrimary={true} buttonStyle={ButtonStyles.BUTTON_GREEN} link="/events/new" className={["flex justify-center items-center gap-2"]}>
                        <i className="fa-solid fa-plus"></i>
                        Добавить
                    </Button>
                }  
            </div>}>
            <div className="grid grid-cols-3 gap-y-4 gap-x-6 justify-items-center content-center">
                {
                    events.map((v, i) => <EventTile key={v.id} {...v} />)
                }
            </div>
        </PageLayout>
    );
}
