import React, { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getErrors } from "../../../api";
import { EventService } from "../../../api/services/EventService";
import { PageLayout } from "../../../components/layouts/PageLayout";
import { Button, ButtonStyles } from "../../../components/UI/buttons/Button";
import { SubmitButton } from "../../../components/UI/buttons/SubmitButton";
import { FormInput } from "../../../components/UI/forms/FormInput";
import { AddressInput } from "../../../components/UI/inputs/AddressInput";
import { DateTimeInput } from "../../../components/UI/inputs/DateTimeInput";
import {
    AcceptedTypes,
    FileUpload,
} from "../../../components/UI/inputs/FileUpload";
import { Select } from "../../../components/UI/inputs/select/Select";
import { Textarea } from "../../../components/UI/inputs/Textarea";
import { List } from "../../../components/UI/list/List";
import { ListItem } from "../../../components/UI/list/ListItem";
import { useForm } from "../../../hooks/forms/useForm";
import {
    IS_NOT_EMPTY,
    MAX_LENGTH,
    MIN_LENGTH,
} from "../../../hooks/useValidation";
import { IFormInputData, IFormInputStatus, IServerError } from "../../../types";
import { IAddress, IExtendedEventResponse } from "../../../types/Api";

interface Response {
    event: IExtendedEventResponse;
}

export const EditEvent: FC = () => {
    const navigate = useNavigate();
    const { eventId } = useParams();
    const [event, setEvent] = useState<IExtendedEventResponse>();
    const [address, setAddress] = useState<IAddress>();

    const data: { [key: string]: IFormInputData } = {
        title: {
            label: "Название",
            type: "text",
            autoComplete: "off",
            validation: [
                IS_NOT_EMPTY("Укажите название"),
                MIN_LENGTH(3),
                MAX_LENGTH(70),
            ],
        },
        address: {
            label: "Адрес",
            type: "text",
            autoComplete: "off",
            validation: [IS_NOT_EMPTY("Укажите адрес"), MAX_LENGTH(150)],
        },
    };
    const infoForm = useForm(sendFormData);
    const categories = [
        { id: 1, name: "Business", title: "Бизнес" },
        { id: 2, name: "IT", title: "ИТ и интернет" },
        { id: 3, name: "Science", title: "Наука" },
        { id: 4, name: "Hobby", title: "Хобби и творчество" },
        { id: 5, name: "Languages", title: "Иностранные языки" },
        { id: 6, name: "Culture", title: "Искусство и культура" },
        { id: 7, name: "Movie", title: "Кино" },
        { id: 8, name: "Sport", title: "Спорт" },
        { id: 9, name: "Exhibition", title: "Выставки" },
        { id: 10, name: "Concert", title: "Концерты" },
        { id: 11, name: "Other", title: "Другие события" },
        { id: 12, name: "OtherEntertaiment", title: "Другие развлечения" },
    ];

    const eventType = [
        { id: 0, name: "Offline", title: "Офлайн" },
        { id: 1, name: "Online", title: "Онлайн" },
    ];

    async function sendFormData(data: {
        [key: string]: IFormInputStatus;
    }): Promise<IServerError> {
        console.log("sent!");
        const result = Object.entries(data).map(([key, d]) => [key, d.value]);

        let errors = {};
        try {
            if (eventId) {
                await EventService.updateEvent(
                    Number(eventId),
                    Object.fromEntries(result)
                );
                navigate(`/events/${eventId}/questions`);
            } else {
                const response = await EventService.createEvent(
                    Object.fromEntries(result)
                );
                navigate(`/events/${response.data.id}/questions`);
            }
        } catch (e) {
            errors = getErrors(e);
        }

        return errors;
    }

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        if (eventId) {
            const getEvent = async () => {
                if (!eventId) return;
                try {
                    const response = await EventService.get<Response>(
                        Number(eventId)
                    );
                    setEvent(response.data.event);
                    // get values from the server
                    setAddress(response.data.event.address);
                } catch (e) {
                    return;
                }
            };

            getEvent();
        }
    }, []);

    useEffect(() => {
        infoForm.hideInputStatus(
            "address",
            infoForm.getInputStatus("type")?.value !== eventType[0].id
        );
    }, [infoForm.getInputStatus("type")]);

    return (
        <PageLayout
            title={event ? "Настройка мероприятия" : "Новое мероприятие"}
        >
            <div className="flex gap-12">
                <List className="w-48 text-black">
                    <ListItem className="text-green">Информация</ListItem>
                    <ListItem
                        link={event && `/events/${eventId}/questions`}
                        className={[
                            "text-darkgray hover:text-gray",
                            !event ? "text-lightgray pointer-events-none" : "",
                        ]}
                    >
                        Анкета
                    </ListItem>
                    <ListItem
                        link={event && `/events/${eventId}/tickets`}
                        className={[
                            "text-darkgray hover:text-gray",
                            !event ? "text-lightgray pointer-events-none" : "",
                        ]}
                    >
                        Билеты
                    </ListItem>
                </List>
                <form
                    className="w-full flex flex-col"
                    onSubmit={infoForm.onSubmit}
                    onChange={infoForm.onChange}
                >
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <h3 className="text-2xl">Основное</h3>
                            <div className="w-96">
                                <FormInput
                                    initialValue={event?.title}
                                    name="title"
                                    data={data.title}
                                    serverError={infoForm.serverErrors["title"]}
                                    isSubmitted={infoForm.isSubmitted}
                                    callBack={infoForm.updateInputStatuses}
                                />
                            </div>
                            <Textarea
                                initialValue={event?.description}
                                name="description"
                                label="Краткое описание:"
                                minLength={50}
                                maxLength={250}
                                className="h-20"
                                serverError={
                                    infoForm.serverErrors["description"]
                                }
                                isSubmitted={infoForm.isSubmitted}
                                callBack={infoForm.updateInputStatuses}
                                additionalText="Краткое описание будет отображаться на странице списка мероприятий"
                            />
                            <Textarea
                                initialValue={event?.fullDescription}
                                name="fulldescription"
                                label="Подробное описание:"
                                minLength={200}
                                className="h-60"
                                serverError={
                                    infoForm.serverErrors["fulldescription"]
                                }
                                isSubmitted={infoForm.isSubmitted}
                                callBack={infoForm.updateInputStatuses}
                                additionalText="Подробное описание будет показываться на страничке мероприятия"
                            />
                        </div>
                        <div>
                            <div>
                                <span className="font-medium">
                                    Начало мероприятия:
                                </span>
                                <div className="flex gap-2 font-roboto text-sm">
                                    <DateTimeInput
                                        initialValue={event?.startDate}
                                        name="startdate"
                                        serverError={
                                            infoForm.serverErrors["startdate"]
                                        }
                                        isFormSubmitted={infoForm.isSubmitted}
                                        callBack={infoForm.updateInputStatuses}
                                    />
                                    <span className="p-2">—</span>
                                    <DateTimeInput
                                        initialValue={event?.endDate}
                                        name="enddate"
                                        serverError={
                                            infoForm.serverErrors["enddate"]
                                        }
                                        isFormSubmitted={infoForm.isSubmitted}
                                        callBack={infoForm.updateInputStatuses}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium">Категория:</span>
                                <div className="w-52">
                                    <Select
                                        name="category"
                                        defaultValue={
                                            event
                                                ? event.category.id
                                                : "Выберите категорию"
                                        }
                                        serverError={
                                            infoForm.serverErrors["category"]
                                        }
                                        options={categories.map(
                                            ({ id, title }) => ({
                                                value: id,
                                                title,
                                            })
                                        )}
                                        isFormSubmitted={infoForm.isSubmitted}
                                        callBack={infoForm.updateInputStatuses}
                                    />
                                </div>
                            </div>
                            <div>
                                <span className="font-medium">Обложка:</span>
                                <FileUpload
                                    name="cover"
                                    title="Выбрать изображение"
                                    acceptedType={AcceptedTypes.IMAGES}
                                    serverError={infoForm.serverErrors["cover"]}
                                    isFormSubmitted={infoForm.isSubmitted}
                                    callBack={infoForm.updateInputStatuses}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-2xl mb-2">Расположение</h3>
                        <div className="flex flex-col">
                            <span className="font-medium">Тип:</span>
                            <div className="w-32">
                                <Select
                                    name="type"
                                    defaultValue={
                                        event ? event.type.id : eventType[0].id
                                    }
                                    serverError={infoForm.serverErrors["type"]}
                                    options={eventType.map(({ id, title }) => ({
                                        value: id,
                                        title,
                                    }))}
                                    isFormSubmitted={infoForm.isSubmitted}
                                    callBack={infoForm.updateInputStatuses}
                                />
                            </div>
                        </div>
                        {infoForm.getInputStatus("type")?.value ===
                            eventType[0].id && (
                            <div className="flex flex-col">
                                <div className="mx-2 mb-2 relative">
                                    <AddressInput
                                        initialValue={address}
                                        name="address"
                                        data={data.address}
                                        serverError={
                                            infoForm.serverErrors["address"]
                                        }
                                        isSubmitted={infoForm.isSubmitted}
                                        callBack={infoForm.updateInputStatuses}
                                        mapClassName="mt-2 mb-6 h-80"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-6">
                            <SubmitButton
                                disabled={infoForm.hasError}
                                isPrimary={true}
                                buttonStyle={
                                    infoForm.hasError
                                        ? ButtonStyles.BUTTON_RED
                                        : ButtonStyles.BUTTON_GREEN
                                }
                            >
                                Продолжить
                            </SubmitButton>
                            {/* <Button isPrimary={true} buttonStyle={ButtonStyles.BUTTON_GRAY}>
                                Сохранить черновик
                            </Button> */}
                        </div>
                        <Button
                            link={eventId ? `/events/${eventId}` : "/events"}
                        >
                            <div className="text-gray hover:text-red">
                                Отмена
                            </div>
                        </Button>
                    </div>
                </form>
            </div>
        </PageLayout>
    );
};
