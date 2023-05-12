import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IChat, IDefaultEvent } from "../../../../types/Api";
import { PageLayout } from "../../../../components/layouts/page-layout/PageLayout";
import { List } from "../../../../components/UI/list/List";
import { ListItem } from "../../../../components/UI/list/ListItem";
import { Status } from "../../../../types/Api";
import { StatusIcon } from "../../../../components/UI/Status";
import EventService from "../../../../api/services/EventService";
import useForm from "../../../../hooks/forms/useForm";
import { IFormInputStatus, IServerError } from "../../../../types";
import { getErrors } from "../../../../api";
import { Textarea } from "../../../../components/UI/inputs/textarea/Textarea";
import { Button, ButtonStyles } from "../../../../components/UI/button/Button";
import { SubmitButton } from "../../../../components/UI/button/SubmitButton";
import { WithIcon } from "../../../../components/UI/with-icon/WithIcon";

interface IChatProps {};

export const Chat: FC<IChatProps> = (props) => {
    const navigate = useNavigate();
    const {eventId, chatId} = useParams();
    const [eventTitle, setTitle] = useState("");
    const [chat, setChat] = useState<IChat>();

    const chatForm = useForm(sendChatFormData);

    const titles = {
        [Status.Active]: "активно",
        [Status.Waiting]: "ожидание ответа",
        [Status.Closed]: "распродано"
    };

    async function sendChatFormData(data: {[key: string]: IFormInputStatus}): Promise<IServerError> {
        console.log("chat message sent!");

        const result = Object.entries(data).map(([key, d]) => [key, d.value]);
        let errors = {};
        try {
            console.log(result);
            // window.location.reload(); // FIX ME
        } catch (e) {
            errors = getErrors(e);
        }

        return errors;
    }

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        if (eventId) {
            // Sending request to server
            const getEvent = async () => {
                if (!eventId)
                    return;

                try {
                    const response = await EventService.getChat(Number(chatId));
                    setChat(response.data);
                    const event = await EventService.get<{event: IDefaultEvent}>(Number(eventId));
                    setTitle(event.data.event.title);
                } catch {
                    navigate("/");
                }
            }
            getEvent();
        }
    }, []);

    return (
        <PageLayout title={eventTitle}>
            <div className="flex gap-12">
                <List className="w-48 text-black">
                    <ListItem link={`/events/${eventId}/statistics`} className="text-darkgray hover:text-gray">Статистика</ListItem>
                    <ListItem link={`/events/${eventId}/participants`} className="text-darkgray hover:text-gray">Участники</ListItem>
                    <ListItem className="text-green" link={`/events/${eventId}/feedback`}>Обратная связь</ListItem>
                </List>
                <div className="flex flex-col gap-8 w-full">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-xl">Детали</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                    <span className="font-light">Индентификатор:</span>
                                    <span>{chat?.id}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-light">Статус:</span>
                                    <StatusIcon status={(Status[chat?.status ?? 0] as unknown) as number} titles={titles} />
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
                                {
                                    chat?.messages.map((m, index) =>
                                        <div className="w-full flex border-b-2 border-slate-300 last:border-b-0" key={index}>
                                            <div className="w-40 px-4 py-2 border-r-2 border-slate-300">
                                                <div>{m.creator}</div>
                                                <span className="text-sm">{m.creationTime}</span>
                                            </div>
                                            <div className="px-4 py-2 whitespace-pre-wrap">{m.text}</div>
                                        </div>
                                    )
                                }
                            </div>
                            <div>
                                <form onSubmit={chatForm.onSubmit} onChange={chatForm.onChange} className="w-[44rem] mt-4">
                                    <Textarea name="text" className="h-60" label="Текст сообщения:" minLength={50} maxLength={4500} serverError={chatForm.serverErrors["text"]} isSubmitted={chatForm.isSubmitted} callBack={chatForm.updateInputStatuses} />
                                    <div className="flex justify-end items-center gap-2">
                                        <Button buttonStyle={ButtonStyles.BUTTON_GRAY} isPrimary={true}>
                                            <WithIcon icon={<i className="fa-regular fa-circle-check text-blue" />}>
                                                Закрыть вопрос с ответом
                                            </WithIcon>
                                        </Button>
                                        <SubmitButton disabled={chatForm.hasError} isPrimary={true}
                                            buttonStyle={chatForm.hasError ? ButtonStyles.BUTTON_RED : ButtonStyles.BUTTON_GREEN}>
                                            Отправить
                                        </SubmitButton>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
