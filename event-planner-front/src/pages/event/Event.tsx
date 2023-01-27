import { FC, useState } from "react";
// import { useParams } from "react-router-dom";
import { PageLayout } from "../../components/layouts/page-layout/PageLayout";
import { Bookmark } from "../../components/UI/bookmark/Bookmark";
import { Location } from "../../components/UI/events/location/Location";
import { WithIcon } from "../../components/UI/with-icon/WithIcon";
import { IEvent } from "../../types";

export const Event: FC = () => {
    // const params = useParams();
    const [event, setEvent] = useState<IEvent>({
        id: 1,
        title: "Заголовок",
        coverUrl: "",
        description: "Описание мероприятия описание описание описание описание",
        category: "Бизнес",
        type: "Offline",
        date: "Понедельник, 12 декабря",
        location: "г. Москва, ...",
        minPrice: 0,
        isFavorite: false
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
            <Bookmark isFavorite={event.isFavorite} className={["text-lg"]} favoriteCallback={setFavorite} />
        }>
            <div className="flex justify-center items-center gap-3">
                <WithIcon icon={<i className="fa-solid fa-calendar"></i>}>
                    {event.date}
                </WithIcon>
                <Location type={event.type} location={event.location} />
            </div>
        </PageLayout>
    );
}
