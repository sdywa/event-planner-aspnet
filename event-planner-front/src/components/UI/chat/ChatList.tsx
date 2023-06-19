import React, { FC } from "react";

import { IEventChat } from "../../../types/Api";
import { Status } from "../../../types/Api";
import { EmptyPlaceholder } from "../EmptyPlaceholder";
import { StatusIcon } from "../Status";
import { Table } from "../Table";

interface IChatListProps {
    chats: IEventChat[];
    rowCallback: (value: IEventChat) => void;
}

export const ChatList: FC<IChatListProps> = ({ chats, rowCallback }) => {
    const titles = {
        [Status.Active]: "активно",
        [Status.Waiting]: "ожидание ответа",
        [Status.Closed]: "закрыт",
    };

    return (
        <>
            {chats.length > 0 ? (
                <Table
                    headers={["Тема", "Статус"]}
                    data={chats as never[]}
                    ceilsSchema={[
                        (value: IEventChat) => (
                            <div className="font-medium w-full overflow-hidden text-ellipsis whitespace-nowrap">
                                {value.theme}
                            </div>
                        ),
                        (value: IEventChat) => (
                            <StatusIcon
                                status={
                                    Status[value.status] as unknown as number
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
                    rowCallback={rowCallback}
                />
            ) : (
                <EmptyPlaceholder text="Пока обращений нет" />
            )}
        </>
    );
};
