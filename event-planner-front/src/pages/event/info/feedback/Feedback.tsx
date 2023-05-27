import React, { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { EventService } from "../../../../api/services/EventService";
import { PageLayout } from "../../../../components/layouts/PageLayout";
import { EmptyPlaceholder } from "../../../../components/UI/EmptyPlaceholder";
import { List } from "../../../../components/UI/list/List";
import { ListItem } from "../../../../components/UI/list/ListItem";
import { StatusIcon } from "../../../../components/UI/Status";
import { Table } from "../../../../components/UI/Table";
import { IEventChat, IEventChatResponse } from "../../../../types/Api";
import { Status } from "../../../../types/Api";

export const Feedback: FC = () => {
    const navigate = useNavigate();
    const { eventId } = useParams();
    const [eventTitle, setTitle] = useState("");
    const [chats, setChats] = useState<IEventChatResponse>();

    const titles = {
        [Status.Active]: "активно",
        [Status.Waiting]: "ожидание ответа",
        [Status.Closed]: "закрыт",
    };

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        if (eventId) {
            // Sending request to server
            const getEvent = async () => {
                if (!eventId) return;

                try {
                    const response = await EventService.getChats(
                        Number(eventId)
                    );
                    setTitle(response.data.title);
                    setChats(response.data);
                } catch {
                    navigate("/");
                }
            };
            getEvent();
        }
    }, []);

    return (
        <PageLayout title={eventTitle}>
            <div className="flex gap-12">
                <List className="w-48 text-black">
                    <ListItem
                        link={`/events/${eventId}/statistics`}
                        className="text-darkgray hover:text-gray"
                    >
                        Статистика
                    </ListItem>
                    <ListItem
                        link={`/events/${eventId}/participants`}
                        className="text-darkgray hover:text-gray"
                    >
                        Участники
                    </ListItem>
                    <ListItem className="text-green">Обратная связь</ListItem>
                </List>
                <div className="flex flex-col gap-8 w-full">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl">Обращения участников</h3>
                        {chats && chats.chats.length > 0 ? (
                            <Table
                                headers={["Тема", "Статус"]}
                                data={chats.chats as never[]}
                                ceilsSchema={[
                                    (value: IEventChat) => (
                                        <div className="font-medium w-full overflow-hidden text-ellipsis whitespace-nowrap">
                                            {value.theme}
                                        </div>
                                    ),
                                    (value: IEventChat) => (
                                        <StatusIcon
                                            status={
                                                Status[
                                                    value.status
                                                ] as unknown as number
                                            }
                                            titles={titles}
                                        />
                                    ),
                                    () => (
                                        <div className="w-6">
                                            <i className="fa-solid fa-chevron-right my-2 text-slate-400"></i>
                                        </div>
                                    ),
                                ]}
                                rowCallback={(value: IEventChat) => {
                                    navigate(
                                        `/events/${eventId}/chats/${value.id}`
                                    );
                                }}
                            />
                        ) : (
                            <EmptyPlaceholder text="Пока обращений нет" />
                        )}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};
