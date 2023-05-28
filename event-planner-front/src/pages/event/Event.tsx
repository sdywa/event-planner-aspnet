/* eslint-disable indent */
import React, { FC, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";
import { observer } from "mobx-react-lite";

import { Context } from "../..";
import { getErrors } from "../../api";
import { EventService } from "../../api/services/EventService";
import { PageLayout } from "../../components/layouts/PageLayout";
import { Bookmark } from "../../components/UI/Bookmark";
import { Button, ButtonStyles } from "../../components/UI/buttons/Button";
import { SubmitButton } from "../../components/UI/buttons/SubmitButton";
import { DropdownMenu } from "../../components/UI/DropdownMenu";
import { Location } from "../../components/UI/event/Location";
import { Tile } from "../../components/UI/event/Tile";
import { FormInput } from "../../components/UI/forms/FormInput";
import { RadioButton } from "../../components/UI/inputs/RadioButton";
import { Textarea } from "../../components/UI/inputs/Textarea";
import { Map } from "../../components/UI/Map";
import { Modal } from "../../components/UI/Modal";
import { WithIcon } from "../../components/UI/WithIcon";
import { useForm } from "../../hooks/forms/useForm";
import {
    IS_NOT_EMPTY,
    MAX_LENGTH,
    MIN_LENGTH,
} from "../../hooks/useValidation";
import { IFormInputData, IFormInputStatus, IServerError } from "../../types";
import {
    IAnswer,
    IEventResponse,
    IExtendedEventResponse,
    IParticipationModel,
} from "../../types/Api";

interface IEvent extends IExtendedEventResponse {
    isParticipated: boolean;
}

interface IEventWithPrice extends IEventResponse {
    minPrice: number;
}

interface IEventDataResponse {
    event: IEvent;
    advertising: IEventWithPrice[];
}

export const Event: FC = observer(() => {
    const navigate = useNavigate();
    const { eventId } = useParams();
    const { user } = useContext(Context);
    const [event, setEvent] = useState<IEvent>();
    const [advertising, setAdvertising] = useState<IEventWithPrice[]>();
    const {
        serverErrors,
        isSubmitted,
        getInputStatus,
        updateInputStatuses,
        onChange,
        onSubmit,
        hasError,
    } = useForm(sendFormData);
    const feedbackForm = useForm(sendFeedbackFormData);
    const [modalActive, setActive] = useState(false);
    const defaultFormInputData = (label: string): IFormInputData => {
        return {
            label: label,
            type: "text",
            autoComplete: "off",
            validation: [IS_NOT_EMPTY()],
        };
    };

    async function sendFormData(data: {
        [key: string]: IFormInputStatus;
    }): Promise<IServerError> {
        console.log("sent!");

        const parsed = Object.fromEntries(
            Object.entries(data).map(([key, d]) => [key, d.value])
        );
        const result: IParticipationModel = {
            ticketId: Number(parsed["ticket"]),
            answers: Object.keys(parsed)
                .filter((k) => k !== "ticket")
                .map((k): IAnswer => {
                    const key = Number(k);
                    return {
                        questionId: key,
                        text: parsed[k],
                    };
                }),
        };

        let errors = {};
        try {
            await EventService.participate(Number(eventId), result);
            if (event) setEvent({ ...event, isParticipated: true });
        } catch (e) {
            errors = getErrors(e);
        }

        return errors;
    }

    async function sendFeedbackFormData(data: {
        [key: string]: IFormInputStatus;
    }): Promise<IServerError> {
        console.log("question sent!");

        const result = Object.entries(data).map(([key, d]) => [key, d.value]);
        let errors = {};
        try {
            await EventService.createChat(
                Number(eventId),
                Object.fromEntries(result)
            );
            window.location.reload(); // FIX ME
        } catch (e) {
            errors = getErrors(e);
        }

        return errors;
    }

    function setFavorite(value: boolean) {
        if (!event) return;

        EventService.setFavorite(event.id, { isFavorite: value });
        const nextEvent = {
            ...event,
            isFavorite: value,
        };
        setEvent(nextEvent);
    }

    function parseDate(date: Date, weekday = true) {
        const currentYear = new Date().getFullYear();
        const options: Intl.DateTimeFormatOptions = {
            weekday: weekday ? "long" : undefined,
            day: "numeric",
            month: "long",
            year: currentYear !== date.getFullYear() ? "numeric" : undefined,
        };
        return date.toLocaleDateString("ru-RU", options);
    }

    function getNounPluralForm(
        number: number,
        one: string,
        two: string,
        many: string
    ) {
        const mod10 = number % 10;
        const mod100 = number % 100;

        switch (true) {
            case mod100 >= 11 && mod100 <= 20:
                return many;

            case mod10 > 5:
                return many;

            case mod10 === 1:
                return one;

            case mod10 >= 2 && mod10 <= 4:
                return two;

            default:
                return many;
        }
    }

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        const getEvent = async () => {
            if (!eventId) return;

            try {
                const events = await EventService.get<IEventDataResponse>(
                    Number(eventId)
                );
                setEvent(events.data.event);
                setAdvertising(events.data.advertising);
                window.scrollTo(0, 0);
            } catch (e) {
                navigate("/");
                return;
            }
        };

        getEvent();
    }, [eventId]);

    function getQuestionInitialValue(index: number) {
        if (index === 0) return user.user.email;
        else if (index === 1) return user.user.name;
        else if (index === 2) return user.user.surname;
        return "";
    }

    return (
        <PageLayout
            title={event?.title ?? ""}
            isCentered={true}
            header={
                user.isAuth && (
                    <Bookmark
                        isFavorite={event?.isFavorite ?? false}
                        className={"text-lg"}
                        favoriteCallback={setFavorite}
                    />
                )
            }
        >
            {user.isAuth && (
                <Modal active={modalActive} setActive={setActive}>
                    <div className="flex justify-between items-center">
                        <h3 className="heading--tertiary text-2xl">
                            Связаться с организатором
                        </h3>
                        <Link
                            to="#"
                            className="text-gray hover:text-darkgray transition-colors duration-150 ease-in"
                            onClick={(
                                e: React.MouseEvent<HTMLAnchorElement>
                            ) => {
                                e.preventDefault();
                                setActive(false);
                            }}
                        >
                            <i className="fa-solid fa-xmark text-3xl w-8 h-8"></i>
                        </Link>
                    </div>
                    <form
                        onSubmit={feedbackForm.onSubmit}
                        onChange={feedbackForm.onChange}
                        className="w-[44rem] mt-4"
                    >
                        <div className="w-96">
                            <FormInput
                                name="theme"
                                data={{
                                    label: "Тема обращения",
                                    type: "text",
                                    autoComplete: "off",
                                    validation: [
                                        IS_NOT_EMPTY(),
                                        MIN_LENGTH(10),
                                        MAX_LENGTH(150),
                                    ],
                                }}
                                serverError={feedbackForm.serverErrors["theme"]}
                                isSubmitted={feedbackForm.isSubmitted}
                                callBack={feedbackForm.updateInputStatuses}
                            />
                        </div>
                        <Textarea
                            name="text"
                            className="h-60"
                            label="Текст сообщения:"
                            minLength={50}
                            maxLength={4500}
                            serverError={feedbackForm.serverErrors["text"]}
                            isSubmitted={feedbackForm.isSubmitted}
                            callBack={feedbackForm.updateInputStatuses}
                        />
                        <div className="flex justify-end items-center gap-2">
                            <Button onClick={() => setActive(false)}>
                                <div className="text-gray">Отмена</div>
                            </Button>
                            <SubmitButton
                                disabled={feedbackForm.hasError}
                                isPrimary={true}
                                buttonStyle={
                                    feedbackForm.hasError
                                        ? ButtonStyles.BUTTON_RED
                                        : ButtonStyles.BUTTON_GREEN
                                }
                            >
                                Отправить
                            </SubmitButton>
                        </div>
                    </form>
                </Modal>
            )}
            {user.isAuth && user.user.id === event?.creator.id && (
                <div className="flex items-center justify-center">
                    <DropdownMenu
                        items={[
                            {
                                label: "Информация",
                                link: `/events/${eventId}/edit`,
                            },
                            {
                                label: "Анкета",
                                link: `/events/${eventId}/questions`,
                            },
                            {
                                label: "Билеты",
                                link: `/events/${eventId}/tickets`,
                            },
                            {
                                label: (
                                    <span className="text-red">Удалить</span>
                                ),
                                onClick: async () => {
                                    if (
                                        window.confirm("Удалить мероприятие?")
                                    ) {
                                        await EventService.deleteEvent(
                                            event.id
                                        );
                                        navigate("/");
                                    }
                                },
                            },
                        ]}
                    >
                        <Button
                            buttonStyle={ButtonStyles.BUTTON_GREEN}
                            className="py-2"
                        >
                            <WithIcon
                                icon={<i className="fa-solid fa-pen"></i>}
                            >
                                <span className="text-base font-semibold">
                                    Изменить
                                </span>
                            </WithIcon>
                        </Button>
                    </DropdownMenu>
                    <DropdownMenu
                        items={[
                            {
                                label: "Статистика",
                                link: `/events/${eventId}/statistics`,
                            },
                            {
                                label: "Участники",
                                link: `/events/${eventId}/participants`,
                            },
                            {
                                label: "Обратная связь",
                                link: `/events/${eventId}/chats`,
                            },
                        ]}
                    >
                        <Button
                            buttonStyle={ButtonStyles.BUTTON_GREEN}
                            className="py-2"
                        >
                            <WithIcon
                                icon={
                                    <i className="fa-solid fa-box-archive"></i>
                                }
                            >
                                <span className="text-base font-semibold">
                                    Управление
                                </span>
                            </WithIcon>
                        </Button>
                    </DropdownMenu>
                </div>
            )}
            <div className="m-auto max-w-2xl flex flex-wrap justify-center items-center gap-x-4">
                <WithIcon icon={<i className="fa-solid fa-tags"></i>}>
                    {event?.category.title}
                </WithIcon>
                {event?.startDate && (
                    <WithIcon icon={<i className="fa-solid fa-calendar"></i>}>
                        {parseDate(new Date(event.startDate))}
                    </WithIcon>
                )}
            </div>
            <div className="flex justify-center items-center gap-4 py-4 relative">
                <div className="flex flex-col justify-center items-start gap-4">
                    <div className="w-[44rem] h-[25rem] relative bg-lightgray rounded-md overflow-hidden">
                        {event?.cover && (
                            <img
                                src={"data:image/png;base64," + event.cover}
                                alt={event.title}
                                className="absolute -translate-y-1/2 top-1/2 w-full"
                            />
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-8 w-full">
                    <div className="flex flex-col gap-2 justify-center">
                        {event?.address && (
                            <>
                                <span className="text-sm">
                                    <Location
                                        type={event?.type.id}
                                        location={event?.address?.full}
                                    />
                                </span>
                                <Map
                                    address={event?.address}
                                    className="h-44 rounded-lg"
                                />
                            </>
                        )}
                    </div>
                    <div className="w-full h-full flex flex-col justify-center items-center gap-2">
                        <div className="relative px-4 py-6 w-72 flex flex-col justify-center items-center border-2 border-lightgray rounded-md">
                            {/* <div className="absolute -top-1/2 translate-y-1/2 w-28 h-28 bg-lightgray rounded-full border-4 border-white"></div> */}
                            <h3 className="text-2xl text-center">
                                {event?.creator.name} {event?.creator.surname}
                            </h3>
                            <div className="text-base">
                                {event?.creator.eventsCount}{" "}
                                {getNounPluralForm(
                                    event?.creator.eventsCount ?? 0,
                                    "мероприятие",
                                    "мероприятия",
                                    "мероприятий"
                                )}
                            </div>
                            <div className="flex justify-center items-center gap-1 text-base">
                                <span className="font-medium">
                                    {(
                                        event?.creator.rating ?? 5
                                    ).toLocaleString(undefined, {
                                        minimumFractionDigits: 1,
                                        maximumFractionDigits: 2,
                                    })}
                                </span>
                                <i className="fa-solid fa-star text-yellow"></i>
                            </div>
                        </div>
                        {user.isAuth && user.user.id !== event?.creator.id && (
                            <Button
                                buttonStyle={ButtonStyles.BUTTON_BLUE}
                                onClick={() => setActive(true)}
                            >
                                <WithIcon
                                    icon={
                                        <i className="fa-regular fa-circle-question"></i>
                                    }
                                >
                                    <span className="text-base">
                                        Связаться с организатором
                                    </span>
                                </WithIcon>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <div className="relative">
                <div
                    className={clsx([
                        "text-base whitespace-pre-wrap break-words",
                        advertising?.length ? "w-[calc(100%-19rem)]" : "w-full",
                    ])}
                >
                    {event?.fullDescription}
                </div>
                {advertising && advertising?.length !== 0 && (
                    <div className="absolute right-0 top-0 h-full overflow-y-scroll pb-8 pr-2">
                        <h3 className="text-2xl pb-2">Также рекомендуем</h3>
                        <div className="flex flex-col gap-8 justify-items-center content-center">
                            {advertising.map((v) => (
                                <Tile
                                    key={v.id}
                                    isAuth={user.isAuth}
                                    minPrice={v.minPrice}
                                    event={v}
                                    className="w-64 h-64"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-8">
                {user.isAuth && (
                    <div className="py-2 flex justify-center">
                        <div>
                            {event?.isParticipated ? (
                                <h3 className="heading--tertiary mt-2">
                                    Вы уже зарегистрировались на мероприятие
                                </h3>
                            ) : (
                                <>
                                    <h3 className="heading--tertiary mb-2">
                                        Регистрация
                                    </h3>
                                    <form
                                        onSubmit={onSubmit}
                                        onChange={onChange}
                                    >
                                        <div className="flex gap-8 pb-2">
                                            <div className="w-80 max-w-xs">
                                                {event?.questions.map(
                                                    (question, i) => (
                                                        <FormInput
                                                            key={question.id}
                                                            name={question.id.toString()}
                                                            data={defaultFormInputData(
                                                                question.title
                                                            )}
                                                            initialValue={getQuestionInitialValue(
                                                                i
                                                            )}
                                                            serverError={
                                                                serverErrors[
                                                                    question.id.toString()
                                                                ]
                                                            }
                                                            isSubmitted={
                                                                isSubmitted
                                                            }
                                                            callBack={
                                                                updateInputStatuses
                                                            }
                                                        />
                                                    )
                                                )}
                                            </div>
                                            <div className="min-w-[20rem] max-w-sm">
                                                <div className="flex justify-between font-bold pb-5">
                                                    <div>Название билета</div>
                                                    <div className="w-24 text-center">
                                                        Цена
                                                    </div>
                                                </div>
                                                <ul>
                                                    {event?.tickets.map(
                                                        (
                                                            {
                                                                id,
                                                                title: name,
                                                                until,
                                                                price,
                                                            },
                                                            i
                                                        ) => (
                                                            <RadioButton
                                                                key={name}
                                                                name="ticket"
                                                                id={name}
                                                                value={id.toString()}
                                                                defaultChecked={
                                                                    i === 0
                                                                }
                                                                callBack={
                                                                    updateInputStatuses
                                                                }
                                                            >
                                                                <div className="flex justify-between gap-4">
                                                                    <div className="w-60">
                                                                        <div className="font-ubuntu font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
                                                                            {
                                                                                name
                                                                            }
                                                                        </div>
                                                                        <div className="text-sm">
                                                                            до{" "}
                                                                            {parseDate(
                                                                                new Date(
                                                                                    until
                                                                                ),
                                                                                false
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="w-24 text-center">
                                                                        {price ? (
                                                                            <div>
                                                                                <span className="font-bold">
                                                                                    {
                                                                                        price
                                                                                    }
                                                                                </span>{" "}
                                                                                руб.
                                                                            </div>
                                                                        ) : (
                                                                            <span className="font-bold">
                                                                                Бесплатно
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </RadioButton>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                        <SubmitButton
                                            disabled={hasError}
                                            isPrimary={true}
                                            buttonStyle={
                                                hasError
                                                    ? ButtonStyles.BUTTON_RED
                                                    : ButtonStyles.BUTTON_GREEN
                                            }
                                        >
                                            {event?.tickets.find(
                                                (t) =>
                                                    t.id ===
                                                    Number(
                                                        getInputStatus("ticket")
                                                            ?.value
                                                    )
                                            )?.price
                                                ? "Купить билет"
                                                : "Зарегистрироваться"}
                                        </SubmitButton>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
});
