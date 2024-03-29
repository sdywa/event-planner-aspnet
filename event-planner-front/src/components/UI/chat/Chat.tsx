/* eslint-disable indent */
import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getErrors } from "../../../api";
import { ChatService } from "../../../api/services/ChatService";
import { useForm } from "../../../hooks/forms/useForm";
import { useUser } from "../../../hooks/useUserContext";
import { IFormInputStatus, IServerError } from "../../../types";
import { IChat } from "../../../types/Api";
import { Status } from "../../../types/Api";
import { ButtonStyles } from "../buttons/Button";
import { SubmitButton } from "../buttons/SubmitButton";
import { Textarea } from "../inputs/Textarea";
import { StatusIcon } from "../Status";
import { WithIcon } from "../WithIcon";

interface IChatProps {
    chat: IChat;
    callback: (value: IChat) => void;
}

export const Chat: FC<IChatProps> = ({ chat, callback }) => {
    const navigate = useNavigate();
    const { user } = useUser();
    const chatForm = useForm(sendChatFormData);
    const [closeChat, setClose] = useState(false);
    const [trigger, setTrigger] = useState(false);

    const titles = {
        [Status.Active]: "активно",
        [Status.Waiting]: "ожидание ответа",
        [Status.Closed]: "закрыт",
    };

    async function sendChatFormData(data: {
        [key: string]: IFormInputStatus;
    }): Promise<IServerError> {
        console.log("chat message sent!");

        const result = Object.entries(data).map(([key, d]) => [key, d.value]);
        let errors = {};
        try {
            const response = await ChatService.sendMessage(
                chat.id,
                Object.fromEntries([...result, ["closeChat", closeChat]])
            );
            callback(response.data);
            setTrigger(!trigger);
        } catch (e) {
            errors = getErrors(e);
        }

        return errors;
    }

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        const status = chatForm.getInputStatus("text");
        if (status) {
            status.value = "";
            status.removeDirty();
            chatForm.updateInputStatuses("text", status);
            chatForm.reset();
        }
    }, [trigger]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl">Детали</h3>
                    <span
                        className="text-green font-medium cursor-pointer"
                        onClick={() => navigate(-1)}
                    >
                        Обратно <i className="fa-solid fa-turn-up"></i>
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                        <span className="font-light">Индентификатор:</span>
                        <span>{chat?.id}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-light">Статус:</span>
                        <StatusIcon
                            status={
                                Status[chat?.status ?? 0] as unknown as number
                            }
                            titles={titles}
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-light">Тема:</span>
                        <span>{chat?.theme}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-light">Создатель:</span>
                        <span>{chat?.creator}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-light">Создано:</span>
                        <span>{chat?.creationTime}</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-xl">Переписка</h3>
                <div className="flex flex-col">
                    {chat?.messages.map((m, index) => (
                        <div
                            className="w-full flex border-b-2 border-slate-300 last:border-b-0"
                            key={index}
                        >
                            <div className="w-40 px-4 py-2 border-r-2 border-slate-300">
                                <div>{m.creator}</div>
                                <span className="text-xs">
                                    {new Date(m.creationTime).toLocaleString()}
                                </span>
                            </div>
                            <div className="px-4 py-2 whitespace-pre-wrap break-all w-full">
                                {m.text}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-2">
                    <form
                        onSubmit={chatForm.onSubmit}
                        onChange={chatForm.onChange}
                        className="w-full"
                    >
                        <Textarea
                            name="text"
                            className="h-60"
                            label="Текст сообщения:"
                            minLength={50}
                            maxLength={4500}
                            serverError={chatForm.serverErrors["text"]}
                            isSubmitted={chatForm.isSubmitted}
                            callBack={chatForm.updateInputStatuses}
                            key={Number(trigger)}
                        />
                        <div className="flex justify-end items-center gap-2">
                            {chat &&
                            (Status[chat.status] as unknown as number) ===
                                Status.Closed ? (
                                <>
                                    <SubmitButton
                                        isPrimary={true}
                                        onClick={() => setClose(false)}
                                        buttonStyle={
                                            chatForm.hasError
                                                ? ButtonStyles.BUTTON_RED
                                                : ButtonStyles.BUTTON_GRAY
                                        }
                                    >
                                        <WithIcon
                                            icon={
                                                <i className="fa-solid fa-rotate text-green" />
                                            }
                                        >
                                            Открыть вопрос
                                        </WithIcon>
                                    </SubmitButton>
                                    {user.user.id !== chat.creatorId && (
                                        <SubmitButton
                                            disabled={chatForm.hasError}
                                            isPrimary={true}
                                            buttonStyle={
                                                chatForm.hasError
                                                    ? ButtonStyles.BUTTON_RED
                                                    : ButtonStyles.BUTTON_GREEN
                                            }
                                            onClick={() => setClose(true)}
                                        >
                                            Отправить
                                        </SubmitButton>
                                    )}
                                </>
                            ) : (
                                <>
                                    {user.user.id !== chat.creatorId && (
                                        <SubmitButton
                                            isPrimary={true}
                                            onClick={() => setClose(true)}
                                            buttonStyle={
                                                chatForm.hasError
                                                    ? ButtonStyles.BUTTON_RED
                                                    : ButtonStyles.BUTTON_GRAY
                                            }
                                        >
                                            <WithIcon
                                                icon={
                                                    <i className="fa-regular fa-circle-check text-blue" />
                                                }
                                            >
                                                Закрыть вопрос с ответом
                                            </WithIcon>
                                        </SubmitButton>
                                    )}
                                    <SubmitButton
                                        disabled={chatForm.hasError}
                                        isPrimary={true}
                                        buttonStyle={
                                            chatForm.hasError
                                                ? ButtonStyles.BUTTON_RED
                                                : ButtonStyles.BUTTON_GREEN
                                        }
                                        onClick={() => setClose(false)}
                                    >
                                        Отправить
                                    </SubmitButton>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
