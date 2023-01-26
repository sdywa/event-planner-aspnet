import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import { PageLayout } from "../../components/layouts/page-layout/PageLayout";
import { IEvent } from "../../types";

export const Event: FC = () => {
    const params = useParams();
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

    return (
        <PageLayout title={event.title} isCentered={true} header={
            <div className="bookmark">
                <i className="fa-solid fa-bookmark"></i>
            </div>
        }>
            <div className="flex justify-center items-center gap-5">
                <span>
                    <i className="fa-solid fa-calendar"></i> {event.date}
                </span>
                {
                    event.type === "Offline"
                    ?
                    <span>
                        <i className="fa-solid fa-location-dot"></i> {event.location}
                    </span>
                    :
                    <span>
                        <i className="fa-solid fa-link"></i> Онлайн
                    </span>
                }
            </div>
        </PageLayout>
    );
}
