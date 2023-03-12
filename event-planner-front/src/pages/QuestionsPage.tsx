import { FC, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageLayout } from "../components/layouts/page-layout/PageLayout";
import { IFormInputStatus, IFormInputData, IServerError } from "../types";
import { IEventQuestion } from "../types/Api";
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
import { IDefaultEvent } from "../types/Api";
import EventService from "../api/services/EventService";
import { getErrors } from "../api";

export const QuestionsPage: FC = () => {
    const navigate = useNavigate();
    const {eventId} = useParams();
    const [eventTitle, setTitle] = useState("");
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

            const getEvent = async () => {
                if (!eventId)
                    return;

                try {
                    const event = await EventService.get<IDefaultEvent>(Number(eventId));
                    setTitle(event.data.title);
                    const questions = await EventService.getQuestions(Number(eventId));
                    setQuestions(questions.data);
                } catch {
                    navigate("/");
                }
            }
            getEvent();
        }
    }, []);

    function createQuestion() {
        const question: IEventQuestion = {
            id: createdCount,
            title: "",
            isEditable: true
        }
        setQuestions([...questions, question]);
        setActiveQuestions([...activeQuestions, question.id]);
        setCreatedCount(createdCount - 1);
        return renderQuestion(question);
    }

    function renderQuestion(question: IEventQuestion) {
        return (
            <DraggableItem key={question.id} className="border-b-2 border-lightgray group h-12">
                <EditableItem isActive={activeQuestions.includes(question.id)} showButtons={question.isEditable}
                open={() => openQuestion(question.id)} close={() => closeQuestion(question.id)} remove={() => removeQuestion(question.id)}
                activeState={
                    <FormInput initialValue={questionForm.getInputStatus(question.id.toString())?.value || question.title} name={question.id.toString()} data={defaultFormInputData} serverError={questionForm.serverErrors[question.id.toString()]} isSubmitted={questionForm.isSubmitted} callBack={questionForm.updateInputStatuses} showError={false} className="p-0" />
                }
                defaultState={
                    <span className="font-medium">{questionForm.getInputStatus(question.id.toString())?.value || question.title}</span>
                } />
            </DraggableItem>
        );
    }

    async function sendFormData(data: {[key: string]: IFormInputStatus}): Promise<IServerError> {
        console.log("sent!");
        const result = Object.entries(data).map(([key, d]): IEventQuestion => {
            const id = Number(key);
            return {
                id: id,
                title: d.value,
                isEditable: questions.find(q => q.id === id)?.isEditable
            };
        });

        let errors = {};
        try {
            await EventService.sendQuestions(Number(eventId), result);
            navigate(`/events/${eventId}/tickets`);
        } catch (e) {
            errors = getErrors(e);
        }

        return errors;
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
        <PageLayout title={eventTitle}>
            <div className="flex gap-12">
                <List className="w-48 text-black">
                    <ListItem link={`/events/${eventId}/edit`} className="text-darkgray hover:text-gray">Информация</ListItem>
                    <ListItem className="text-green">Анкета</ListItem>
                    <ListItem link={`/events/${eventId}/tickets`} className="text-darkgray hover:text-gray">Билеты</ListItem>
                </List>
                <div className="flex flex-col gap-2">
                    <h3 className="text-xl">Регистрация на событие</h3>
                    <form className="flex flex-col justify-start gap-4" onSubmit={questionForm.onSubmit} onChange={questionForm.onChange}>
                        <div className="w-80">
                            <span>Вопросы анкеты:</span>
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
                                {/* <Button isPrimary={true} buttonStyle={ButtonStyles.BUTTON_GRAY}>
                                    Сохранить черновик
                                </Button> */}
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
