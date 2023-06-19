import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserService } from "../../api/services/UserService";
import { PageLayout } from "../../components/layouts/PageLayout";
import { EmptyPlaceholder } from "../../components/UI/EmptyPlaceholder";
import { Tile } from "../../components/UI/event/Tile";
import { List } from "../../components/UI/list/List";
import { ListItem } from "../../components/UI/list/ListItem";
import { useUser } from "../../hooks/useUserContext";
import { IEventResponse } from "../../types/Api";

interface IHistory {
    created: IEventResponse[];
    participated: IEventResponse[];
}

export const History: FC = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [history, setHistory] = useState<IHistory>();
    const [isActive, setActive] = useState(false);

    const [title, setTitle] = useState("");
    const [events, setEvents] = useState<IEventResponse[]>([]);

    const openEvents = (title: string, events: IEventResponse[]) => {
        return (e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            setTitle(title);
            setEvents(events);
            setActive(true);
        };
    };

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        const getHistory = async () => {
            try {
                const response = await UserService.getHistory<IHistory>();
                setHistory(response.data);
            } catch (e) {
                navigate("/");
            }
        };

        getHistory();
    }, []);

    return (
        <PageLayout title="История посещений">
            <div className="flex gap-12">
                <List className="w-48 text-black flex-shrink-0">
                    <ListItem
                        link="/user/settings"
                        className="text-darkgray hover:text-gray"
                    >
                        Настройка аккаунта
                    </ListItem>
                    <ListItem className="text-green">История</ListItem>
                    <ListItem
                        link="/user/chats"
                        className="text-darkgray hover:text-gray"
                    >
                        Обращения
                    </ListItem>
                </List>
                {isActive ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl group-hover:text-green transition-all duration-200 ease-in-out">
                                {title}
                            </h3>
                            <span
                                className="text-green font-medium cursor-pointer"
                                onClick={() => setActive(false)}
                            >
                                Обратно <i className="fa-solid fa-turn-up"></i>
                            </span>
                        </div>
                        {events.length ? (
                            <div className="grid grid-cols-3 gap-y-8 gap-x-6 justify-items-center content-center">
                                {events.map((v) => (
                                    <Tile
                                        key={v.id}
                                        isAuth={user.isAuth}
                                        event={v}
                                        className="w-64 h-72"
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyPlaceholder text="Мероприятия не найдены" />
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-8 w-full">
                        {history?.created && (
                            <div className="flex flex-col items-start gap-2">
                                <div
                                    className="flex items-center justify-center gap-2 cursor-pointer group"
                                    onClick={openEvents(
                                        "Созданные",
                                        history.created
                                    )}
                                >
                                    <h3 className="text-2xl group-hover:text-green transition-all duration-200 ease-in-out">
                                        Созданные
                                    </h3>
                                    <i className="fa-solid fa-chevron-right text-slate-400 group-hover:text-green transition-all duration-200 ease-in-out"></i>
                                </div>
                                {history.created.length ? (
                                    <div className="grid grid-cols-3 gap-y-8 gap-x-6 justify-items-center content-center">
                                        {history.created
                                            .slice(0, 3)
                                            .map((v) => (
                                                <Tile
                                                    key={v.id}
                                                    isAuth={user.isAuth}
                                                    event={v}
                                                    className="w-64 h-72"
                                                />
                                            ))}
                                    </div>
                                ) : (
                                    <EmptyPlaceholder text="У вас нет созданных мероприятий" />
                                )}
                            </div>
                        )}
                        {history?.participated && (
                            <div className="flex flex-col items-start gap-2">
                                <div
                                    className="flex items-center justify-center gap-2 cursor-pointer group"
                                    onClick={openEvents(
                                        "Посещённые",
                                        history.participated
                                    )}
                                >
                                    <h3 className="text-2xl group-hover:text-green transition-all duration-200 ease-in-out">
                                        Посещённые
                                    </h3>
                                    <i className="fa-solid fa-chevron-right text-slate-400 group-hover:text-green transition-all duration-200 ease-in-out"></i>
                                </div>
                                {history.participated.length ? (
                                    <div className="grid grid-cols-3 gap-y-8 gap-x-6 justify-items-center content-center">
                                        {history.participated
                                            .slice(0, 3)
                                            .map((v) => (
                                                <Tile
                                                    key={v.id}
                                                    isAuth={user.isAuth}
                                                    event={v}
                                                    className="w-64 h-72"
                                                />
                                            ))}
                                    </div>
                                ) : (
                                    <EmptyPlaceholder text="Вы нигде не принимали участие" />
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </PageLayout>
    );
};
