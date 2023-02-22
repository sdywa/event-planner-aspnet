import { FC, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageLayout } from "../components/layouts/page-layout/PageLayout";
import { IEditEvent, IEventTicket, IFormInputStatus, IServerError } from "../types";
import useForm from "../hooks/forms/useForm";
import { IS_NOT_EMPTY, MIN_LENGTH, MAX_LENGTH, IS_NUMERIC } from "../hooks/useValidation";
import { EditableItem } from "../components/UI/EditableItem";
import { Button, ButtonStyles } from "../components/UI/button/Button";
import { WithIcon } from "../components/UI/with-icon/WithIcon";
import { SubmitButton } from "../components/UI/button/SubmitButton";
import { List } from "../components/UI/list/List";
import { ListItem } from "../components/UI/list/ListItem";
import { DraggableItem } from "../components/UI/DraggableItem";
import { FormInput } from "../components/UI/forms/form-input/FormInput";
import { DateTimeInput } from "../components/UI/inputs/DateTimeInput";

export const TicketsPage: FC = () => {
    const navigate = useNavigate();
    const {eventId} = useParams();
    const [event, setEvent] = useState<IEditEvent>();

    const [tickets, setTickets] = useState<IEventTicket[]>([]);
    const [activeTickets, setActiveTickets] = useState<number[]>([]);
    const ticketForm = useForm(sendFormData);
    const [createdCount, setCreatedCount] = useState(0);

    const initValues: {
        [key: number]: {
            [key: string]: IFormInputStatus
        }
    } = {};
    const [values, setValues] = useState(initValues);
    const getValueIfExists = (id: number, field: string) => {
        if (id in values && field in values[id])
            return values[id][field].value;
        return "";
    };

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        if (eventId) {
            // Sending request to server
            const event: IEditEvent = {
                id: 1,
                title: "Заголовок",
                cover: "",
                description: "Описание мероприятия описание описание описание описание",
                category: {
                    id: 1,
                    title: "Бизнес"
                },
                type: {
                    id: 1,
                    title: "Оффлайн"
                },
                startDate: "2023-03-17T13:40:00.000Z",
                endDate: "2023-03-17T15:00:00.000",
                address: "г. Москва, очень длинный адрес который может не",
                questions: [
                    {id: 1, name: "Email", editable: false},
                    {id: 2, name: "Ваше имя", editable: false},
                    {id: 3, name: "Ваша фамилия", editable: false},
                    {id: 4, name: "Ваш Возраст", editable: true}
                ],
                tickets: [
                    {id: 1, name: "Входной билет", until: "2023-03-09T21:00:00.000Z", price: 0, limit: 100},
                    {id: 2, name: "Очень длинное название билетаfffffffffааааааа", until: "2023-03-09T21:00:00.000Z", price: 100, limit: 9999}
                ]
            };
            setEvent(event);
            setTickets(event.tickets);
            return;
        } 
        navigate("/")
    }, []);

    function createTicket() {
        const now = new Date();
        now.setDate(now.getDate() + 2);
        now.setHours(now.getHours() + 1, 0, 0);
        const ticket: IEventTicket = {
            id: createdCount,
            name: "",
            until: now.toUTCString(),
            price: 0
        }
        setTickets([...tickets, ticket]);
        setActiveTickets([...activeTickets, ticket.id]);
        setCreatedCount(createdCount - 1);
        return renderTicket(ticket);
    }

    function renderTicket(ticket: IEventTicket) {
        return (
            <DraggableItem key={ticket.id} className="border-b-2 border-lightgray group h-12">
                <EditableItem isActive={activeTickets.includes(ticket.id)}
                open={() => openTicket(ticket.id)} close={() => closeTicket(ticket.id)} remove={() => removeTicket(ticket.id)}
                activeState={
                    <div className="flex justify-between w-full pr-4">
                        <div className="w-64">
                            <FormInput initialValue={ticket.name} name={getName(ticket.id, "name")} data={
                                {
                                    label: "",
                                    type: "text",
                                    autoComplete: "off",
                                    validation: [IS_NOT_EMPTY("Введите вопрос"), MIN_LENGTH(5), MAX_LENGTH(70)]
                                }
                            } serverError={ticketForm.serverErrors[getName(ticket.id, "name")]} isSubmitted={ticketForm.isSubmitted} callBack={ticketCallback(ticket.id, "name")} showError={false} className="p-0 pt-2" />
                        </div>
                        <div className="w-16">
                            <FormInput initialValue={ticket.limit?.toString()} name={getName(ticket.id, "limit")} data={
                                {
                                    label: "",
                                    type: "text",
                                    autoComplete: "off",
                                    validation: [IS_NOT_EMPTY("Введите лимит"), IS_NUMERIC()]
                                }
                            } serverError={ticketForm.serverErrors[getName(ticket.id, "limit")]} isSubmitted={ticketForm.isSubmitted} callBack={ticketCallback(ticket.id, "limit")} showError={false} className="p-0 pt-2 text-center" />
                        </div>
                        <div className="w-24 flex gap-2">
                            <FormInput initialValue={ticket.price.toString()} name={getName(ticket.id, "price")} data={
                                {
                                    label: "",
                                    type: "text",
                                    autoComplete: "off",
                                    validation: [IS_NOT_EMPTY("Введите количество"), IS_NUMERIC()]
                                }
                            } serverError={ticketForm.serverErrors[getName(ticket.id, "price")]} isSubmitted={ticketForm.isSubmitted} callBack={ticketCallback(ticket.id, "price")} showError={false} className="p-0 pt-2 text-center" />
                            <span className="self-center">
                                руб.
                            </span>
                        </div>
                        <div className="w-56">
                            <DateTimeInput initialValue={ticket.until.toString()} name={getName(ticket.id, "until")} serverError={ticketForm.serverErrors[getName(ticket.id, "until")]} isFormSubmitted={ticketForm.isSubmitted} callBack={ticketCallback(ticket.id, "until")} showError={false} />
                        </div>
                    </div>
                } 
                defaultState={
                    <div className="flex justify-between w-full">
                        <div className="w-64 whitespace-nowrap overflow-hidden text-ellipsis">
                            <span className="font-medium">{getValueIfExists(ticket.id, "name")}</span>
                        </div>
                        <div className="font-bold w-16 text-center">{getValueIfExists(ticket.id, "limit")}</div>
                        <div className="font-medium w-24 text-center">{
                            getValueIfExists(ticket.id, "price") !== "0"
                            ?
                            <>
                            <span className="font-bold">{getValueIfExists(ticket.id, "price")} </span>
                            руб.
                            </>
                            :
                            "Бесплатно"}
                        </div>
                        <div className="font-medium w-56 text-center">
                            до
                            <span className="font-bold"> {new Date(getValueIfExists(ticket.id, "until")).toLocaleString("ru-RU")}</span>
                        </div>
                    </div>
                } />
            </DraggableItem>
        );
    }

    const getName = (id: number, field: string) => `${id}_${field}`;

    function ticketCallback(id: number, field: string) {
        const fieldName = getName(id, field);
        if (!(id in values))
            setValues((currValue) => {
                const result = {...currValue};
                result[id] = {};
                return result;
            });
        return function(name: string, value: IFormInputStatus) {
            ticketForm.updateInputStatuses(fieldName, value);
            setValues((currValue) => {
                const result = {...currValue};
                result[id][field] = value;
                return result;
            });
        }
    }

    function sendFormData(data: {[key: string]: IFormInputStatus}): IServerError {
        console.log("sent!");
        navigate("/events");
        return {};
    }

    const openTicket = (id: number) => {
        if (!activeTickets.includes(id))
            setActiveTickets([...activeTickets, id]);
    }

    const closeTicket = (id: number) => {
        if (Object.entries(values[id]).filter(([k, v]) => v.hasError).length === 0)
            setActiveTickets(activeTickets.filter((tId) => tId !== id));
    }

    const removeTicket = (id: number) => {
        setTickets(tickets.filter((t) => t.id !== id));
        ticketForm.hideInputStatus(id.toString(), true);
        setValues((currValue) => {
            const result = {...currValue};
            delete result[id];
            return result;
        });
    }

    return (
        <PageLayout title={event ? event.title : ""}>
            <div className="flex gap-12">
                <List className="w-48 text-black">
                    <ListItem link={event && `/events/${eventId}/edit`} className="text-darkgray hover:text-gray">Информация</ListItem>
                    <ListItem link={event && `/events/${eventId}/questions`} className="text-darkgray hover:text-gray">Анкета</ListItem>
                    <ListItem className="text-green">Билеты</ListItem>
                </List>
                <div className="flex flex-col gap-2 w-full">
                    <h3 className="text-xl">Настройка билетов</h3>
                    <form className="flex flex-col justify-start gap-4" onSubmit={ticketForm.onSubmit} onChange={ticketForm.onChange}>
                        <div className="w-full">
                            <div className="flex justify-between w-full pl-9 pr-16 font-bold">
                                <div className="w-64">
                                    Название
                                </div>
                                <div className="w-16 text-center">
                                    Лимит
                                </div>
                                <div className="w-24 text-center">
                                    Цена
                                </div>
                                <div className="w-56 text-center">
                                    Дата
                                </div>
                            </div>
                            {
                                tickets.map((t) =>
                                    renderTicket(t)
                                )
                            }
                        </div>
                        <div>
                            <Button onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); createTicket();}} buttonStyle={ButtonStyles.BUTTON_GREEN} link="/events/new">
                                <WithIcon icon={<i className="fa-solid fa-plus"></i>}>
                                    Добавить билет
                                </WithIcon>
                            </Button>
                            {
                            ticketForm.hasError && <div className="text-red font-roboto font-bold text-sm h-6 pt-2">Введите валидные значения</div>
                            }
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-6">
                                <SubmitButton disabled={ticketForm.hasError} isPrimary={true} 
                                    buttonStyle={ticketForm.hasError ? ButtonStyles.BUTTON_RED : ButtonStyles.BUTTON_GREEN}>
                                    Продолжить
                                </SubmitButton>
                                <Button isPrimary={true} buttonStyle={ButtonStyles.BUTTON_GRAY}>
                                    Сохранить черновик
                                </Button>
                            </div>
                            <Button link="/events">
                                <div className="text-gray hover:text-red">Отмена</div>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </PageLayout>
    );
}
