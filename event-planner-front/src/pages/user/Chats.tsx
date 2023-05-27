import React, { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ChatService } from "../../api/services/ChatService";
import { UserService } from "../../api/services/UserService";
import { PageLayout } from "../../components/layouts/PageLayout";
import { Chat } from "../../components/UI/chat/Chat";
import { ChatList } from "../../components/UI/chat/ChatList";
import { List } from "../../components/UI/list/List";
import { ListItem } from "../../components/UI/list/ListItem";
import { IEventChat, IEventChatResponse } from "../../types/Api";
import { IChat } from "../../types/Api";

export const Chats: FC = () => {
    const navigate = useNavigate();
    const { chatId } = useParams();
    const [chats, setChats] = useState<IEventChatResponse>();
    const [chat, setChat] = useState<IChat>();

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        const getHistory = async () => {
            try {
                const response = await UserService.getChats();
                setChats(response.data);
            } catch (e) {
                navigate("/");
            }
        };

        getHistory();
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
        <PageLayout title="Список обращений">
            <div className="flex gap-12">
                <List className="w-48 text-black flex-shrink-0">
                    <ListItem
                        link="/user/settings"
                        className="text-darkgray hover:text-gray"
                    >
                        Настройка аккаунта
                    </ListItem>
                    <ListItem
                        link="/user/history"
                        className="text-darkgray hover:text-gray"
                    >
                        История
                    </ListItem>
                    <ListItem className="text-green">Обращения</ListItem>
                </List>
                <div className="flex flex-col gap-8 w-full">
                    {chatId ? (
                        chat && <Chat chat={chat} callback={setChat} />
                    ) : (
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl">Ваши обращения</h3>
                            {chats && (
                                <ChatList
                                    chats={chats.chats}
                                    rowCallback={(value: IEventChat) =>
                                        navigate(`/user/chats/${value.id}`)
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
