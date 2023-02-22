import { FC, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageLayout } from "../components/layouts/page-layout/PageLayout";
import { IEditEvent, IEventQuestion, IFormInputStatus, IFormInputData, IServerError } from "../types";
import { List } from "../components/UI/list/List";
import { ListItem } from "../components/UI/list/ListItem";
import { DraggableItem } from "../components/UI/DraggableItem";
import { FormInput } from "../components/UI/forms/form-input/FormInput";
import useForm from "../hooks/forms/useForm";
import { EditableItem } from "../components/UI/EditableItem";
import { Button, ButtonStyles } from "../components/UI/button/Button";
import { WithIcon } from "../components/UI/with-icon/WithIcon";
import { SubmitButton } from "../components/UI/button/SubmitButton";
import { IS_NOT_EMPTY, MIN_LENGTH, MAX_LENGTH } from "../hooks/useValidation";

export const QuestionsPage: FC = () => {
    const navigate = useNavigate();
    const {eventId} = useParams();
    const [event, setEvent] = useState<IEditEvent>();

    const [questions, setQuestions] = useState<IEventQuestion[]>([]);
    const [activeQuestions, setActiveQuestions] = useState<number[]>([]);
    const questionForm = useForm(sendFormData);
    const [createdCount, setCreatedCount] = useState(0);

    const defaultFormInputData: IFormInputData = {
        label: "",
        type: "text",
        autoComplete: "off",
        validation: [IS_NOT_EMPTY("Введите вопрос"), MIN_LENGTH(5), MAX_LENGTH(70)]
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
                    {id: 1, name: "Входной билет", until: "12.12.2022", price: 0},
                    {id: 2, name: "Очень длинное название билетаfffffffffааааааа", until: "12.12.2022", price: 100}
                ]
            };
            setEvent(event);
            setQuestions(event.questions);
            return;
        } 
        navigate("/")
    }, []);

    function createQuestion() {
        const question: IEventQuestion = {
            id: createdCount,
            name: "",
            editable: true
        }
        setQuestions([...questions, question]);
        setActiveQuestions([...activeQuestions, question.id]);
        setCreatedCount(createdCount - 1);
        return renderQuestion(question);
    }

    function renderQuestion(question: IEventQuestion) {
        return (
            <DraggableItem key={question.id} className="border-b-2 border-lightgray group h-12">
                <EditableItem isActive={activeQuestions.includes(question.id)} showButtons={question.editable}
                open={() => openQuestion(question.id)} close={() => closeQuestion(question.id)} remove={() => removeQuestion(question.id)}
                activeState={
                    <FormInput initialValue={questionForm.getInputStatus(question.id.toString())?.value || question.name} name={question.id.toString()} data={defaultFormInputData} serverError={questionForm.serverErrors[question.id.toString()]} isSubmitted={questionForm.isSubmitted} callBack={questionForm.updateInputStatuses} showError={false} className="p-0" />
                } 
                defaultState={
                    <span className="font-medium">{questionForm.getInputStatus(question.id.toString())?.value || question.name}</span>
                } />
            </DraggableItem>
        );
    }

    function sendFormData(data: {[key: string]: IFormInputStatus}): IServerError {
        console.log("sent!");
        navigate("/events");
        return {};
    }

    const openQuestion = (id: number) => {
        if (!activeQuestions.includes(id))
            setActiveQuestions([...activeQuestions, id]);
    }

    const closeQuestion = (id: number) => {
        setActiveQuestions(activeQuestions.filter((qId) => qId !== id));
    }

    const removeQuestion = (id: number) => {
        setQuestions(questions.filter((q) => q.id !== id));
        questionForm.hideInputStatus(id.toString(), true);
    }

    return (
        <PageLayout title={event ? event.title : ""}>
            <div className="flex gap-12">
                <List className="w-48 text-black">
                    <ListItem link={event && `/events/${eventId}/edit`} className="text-darkgray hover:text-gray">Информация</ListItem>
                    <ListItem className="text-green">Анкета</ListItem>
                    <ListItem link={event && `/events/${eventId}/tickets`} className="text-darkgray hover:text-gray">Билеты</ListItem>
                </List>
                <div className="flex flex-col gap-2">
                    <h3 className="text-xl">Регистрация на событие</h3>
                    <form className="flex flex-col justify-start gap-4" onSubmit={questionForm.onSubmit} onChange={questionForm.onChange}>
                        <span>Вопросы анкеты: </span>
                        <div className="w-80">
                            {
                                questions.map((q) =>
                                    renderQuestion(q)
                                )
                            }
                        </div>
                        <div>
                            <Button onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); createQuestion()}} buttonStyle={ButtonStyles.BUTTON_GREEN} link="/events/new">
                                <WithIcon icon={<i className="fa-solid fa-plus"></i>}>
                                    Добавить вопрос
                                </WithIcon>
                            </Button>
                            {
                            questionForm.hasError && <div className="text-red font-roboto font-bold text-sm h-6 pt-2">Введите валидные значения</div>
                            }
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-6">
                                <SubmitButton disabled={questionForm.hasError} isPrimary={true} 
                                    buttonStyle={questionForm.hasError ? ButtonStyles.BUTTON_RED : ButtonStyles.BUTTON_GREEN}>
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
