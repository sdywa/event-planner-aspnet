import { FC, useState } from "react";
// import { useParams } from "react-router-dom";
import { PageLayout } from "../../components/layouts/page-layout/PageLayout";
import { Bookmark } from "../../components/UI/bookmark/Bookmark";
import { Button, ButtonStyles } from "../../components/UI/button/Button";
import { Location } from "../../components/UI/events/location/Location";
import { WithIcon } from "../../components/UI/with-icon/WithIcon";
import { IExtendedEvent } from "../../types";

export const Event: FC = () => {
    // const params = useParams();
    const [event, setEvent] = useState<IExtendedEvent>({
        id: 1,
        title: "Заголовок",
        coverUrl: "",
        description: "Описание мероприятия описание описание описание описание",
        category: "Бизнес",
        type: "Offline",
        date: "Понедельник, 12 декабря",
        location: "г. Москва, очень длинный адрес который может не",
        minPrice: 0,
        isFavorite: false,
        creator: {
            name: "Создатель Создальевич",
            eventsCount: 20,
            rating: 4.5
        }
    });

    function setFavorite(value: boolean) {
        const nextEvent = {
            ...event,
            isFavorite: value
        };
        setEvent(nextEvent);
    }

    return (
        <PageLayout title={event.title} isCentered={true} header={
            <Bookmark isFavorite={event.isFavorite} size={"text-lg"} favoriteCallback={setFavorite} />
        }>
            <div className="m-auto max-w-2xl flex flex-wrap justify-center items-center gap-3 mt-2">
                <WithIcon icon={<i className="fa-solid fa-calendar"></i>}>
                    {event.date}
                </WithIcon>
                <Location type={event.type} location={event.location} />
            </div>
            <div className="flex justify-center items-center gap-4 py-4 relative">
                <div className="flex flex-col justify-center items-start gap-4">
                    <div className="w-[44rem] h-[25rem] relative bg-lightgray rounded-md">
                        {
                            event.coverUrl && <img src={event.coverUrl} alt={event.title} />
                        }
                    </div>
                    <WithIcon icon={<i className="fa-solid fa-tags"></i>}>
                        Категория
                    </WithIcon>
                </div>
                <div className="w-full h-full flex flex-col justify-center items-center gap-2">
                    <div className="relative p-4 pt-16 w-72 flex flex-col justify-center items-center gap-1 border-2 border-lightgray rounded-md">
                        <div className="absolute -top-1/2 translate-y-1/2 w-28 h-28 bg-lightgray rounded-full border-4 border-white"></div>
                        <h3 className="heading--tertiary text-center">
                            {event.creator.name}
                        </h3>
                        <div className="text-xl">
                            {event.creator.eventsCount} мероприятий
                        </div>
                        <div className="flex justify-center items-center gap-1 text-xl">
                            <span className="font-medium">{event.creator.rating}</span>
                            <i className="fa-solid fa-star text-yellow"></i>
                        </div>
                    </div>
                    <Button buttonStyle={ButtonStyles.BUTTON_BLUE} className={["text-base"]}>
                        <WithIcon icon={<i className="fa-regular fa-circle-question"></i>}>
                            Связаться с организатором
                        </WithIcon>
                    </Button>
                </div>
            </div>
        </PageLayout>
    );
}
