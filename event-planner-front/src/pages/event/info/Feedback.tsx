import React, { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ChatService } from "../../../api/services/ChatService";
import { EventService } from "../../../api/services/EventService";
import { PageLayout } from "../../../components/layouts/PageLayout";
import { Chat } from "../../../components/UI/chat/Chat";
import { ChatList } from "../../../components/UI/chat/ChatList";
import { List } from "../../../components/UI/list/List";
import { ListItem } from "../../../components/UI/list/ListItem";
import { IEventChat, IEventChatResponse } from "../../../types/Api";
import { IChat } from "../../../types/Api";

export const Feedback: FC = () => {
    const navigate = useNavigate();
    const { eventId, chatId } = useParams();
    const [eventTitle, setTitle] = useState("");
    const [chats, setChats] = useState<IEventChatResponse>();
    const [chat, setChat] = useState<IChat>();

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

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        if (chatId) {
            // Sending request to server
            const getEvent = async () => {
                if (!chatId) return;

                try {
                    const response = await ChatService.getChat(Number(chatId));
                    setChat(response.data);
                } catch {
                    navigate("/");
                }
            };
            getEvent();
        }
    }, [chatId]);

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
                    {chatId ? (
                        chat && <Chat chat={chat} callback={setChat} />
                    ) : (
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl">Обращения участников</h3>
                            {chats && (
                                <ChatList
                                    chats={chats.chats}
                                    rowCallback={(value: IEventChat) =>
                                        navigate(
                                            `/events/${eventId}/chats/${value.id}`
                                        )
                                    }
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};
