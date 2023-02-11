import { FC, useState } from "react";
// import { useParams } from "react-router-dom";
import { PageLayout } from "../../components/layouts/page-layout/PageLayout";
import { Bookmark } from "../../components/UI/bookmark/Bookmark";
import { Button, ButtonStyles } from "../../components/UI/button/Button";
import { SubmitButton } from "../../components/UI/button/SubmitButton";
import { Location } from "../../components/UI/events/location/Location";
import { WithIcon } from "../../components/UI/with-icon/WithIcon";
import { FormInput } from "../../components/UI/forms/form-input/FormInput";
import { RadioButton } from "../../components/UI/inputs/radio-button/RadioButton";
import { IS_NOT_EMPTY } from "../../hooks/useValidation";
import useForm from "../../hooks/forms/useForm";
import { Modal } from "../../components/UI/modal/Modal";
import { IExtendedEvent, IFormInputStatus, IFormInputData, IServerError } from "../../types";
import { Textarea } from "../../components/UI/inputs/textarea/Textarea";

export const Event: FC = () => {
    // const params = useParams();
    const isAuth = true;
    const [event, setEvent] = useState<IExtendedEvent>({
        id: 1,
        title: "Заголовок",
        coverUrl: "",
        description: "Описание мероприятия описание описание описание описание",
        fullDescription: `    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sit amet convallis velit. Curabitur varius bibendum ornare. Vestibulum vitae vestibulum lorem. Duis molestie nunc vel mollis molestie. Nullam feugiat tortor eu lacus molestie, nec efficitur lectus finibus. Cras neque ipsum, tempus eget mi a, imperdiet tempus turpis. Vestibulum ac nisi vitae est volutpat finibus. Fusce sagittis magna in ipsum egestas vehicula. Sed mollis tincidunt felis vel mollis. Aliquam ut lectus vel dui auctor congue quis vitae tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.

    Maecenas viverra, lacus a pellentesque aliquet, lacus justo pretium nunc, et rutrum turpis justo et lorem. Morbi sem risus, feugiat eu interdum ac, sollicitudin quis libero. Duis et maximus lectus. Cras porta fringilla nisl, a euismod tortor imperdiet at. Nullam posuere dapibus velit. Praesent at risus sit amet magna pellentesque sollicitudin eu nec justo. Pellentesque sit amet eros at mauris consequat cursus. Curabitur at odio et quam hendrerit accumsan sed ultrices purus. Vestibulum sagittis rutrum efficitur. Vivamus pharetra vel mi ut scelerisque. Phasellus sagittis laoreet erat, sed faucibus purus lacinia at. Sed convallis facilisis eros ac vehicula. Curabitur sit amet accumsan neque, ac viverra lectus. Duis ut libero nec eros scelerisque bibendum tincidunt non lorem. Nullam sed neque tortor.
        
    Nulla faucibus et mauris vitae pharetra. Vestibulum aliquam pulvinar augue, eu molestie sapien finibus vel. Proin consequat, massa et vestibulum tempus, velit leo tincidunt ante, eu aliquet erat lectus id nibh. Cras magna leo, convallis et mauris ut, ullamcorper porttitor augue. Nullam vitae est sed sem porttitor pharetra sed eget odio. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris ut quam eu orci feugiat pellentesque et sed neque. In hac habitasse platea dictumst. Praesent dapibus non purus condimentum iaculis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed iaculis varius placerat. Ut nulla erat, eleifend vitae diam et, porttitor tempor nunc.`,
        category: "Бизнес",
        type: "Offline",
        date: "Понедельник, 12 декабря",
        location: "г. Москва, очень длинный адрес который может не",
        minPrice: 0,
        isFavorite: false,
        creator: {
            name: "Создатель Создальевич",
            eventsCount: 20,
            rating: 4.5
        },
        questions: [
            {id: "1", name: "Email"},
            {id: "2", name: "Имя"},
            {id: "3", name: "Фамилия"},
            {id: "4", name: "Ваш Возраст"}
        ],
        tickets: [
            {id: "1", name: "Входной билет", until: "12.12.2022", price: 0},
            {id: "2", name: "Очень длинное название билетаfffffffffааааааа", until: "12.12.2022", price: 100}
        ]
    });
    const {serverErrors, isSubmitted, getInputStatus, updateInputStatuses, onChange, onSubmit, hasError} = useForm(sendFormData);
    const questionForm = useForm(sendQuestionFormData);
    const [modalActive, setActive] = useState(false);
    const defaultFormInputData = (label: string): IFormInputData => {
        return {
            label: label,
            type: "text",
            autoComplete: "off",
            validation: [IS_NOT_EMPTY()]
        };
    };

    function sendFormData(data: {[key: string]: IFormInputStatus}): IServerError {
        console.log("sent!");
        console.log(Object.values(data).map((a) => console.log(`${a.name}: ${a.value}`)));
        return {};
    }

    function sendQuestionFormData(data: {[key: string]: IFormInputStatus}): IServerError {
        console.log("question sent!");
        return {};
    }

    function setFavorite(value: boolean) {
        const nextEvent = {
            ...event,
            isFavorite: value
        };
        setEvent(nextEvent);
    }

    function setModal(value: boolean) {
        setActive(value);
        if (value)
            document.body.classList.add("overflow-hidden");
        else
            document.body.classList.remove("overflow-hidden");
    }

    return (
        <PageLayout title={event.title} isCentered={true} header={
            <Bookmark isFavorite={event.isFavorite} className={"text-lg"} favoriteCallback={setFavorite} />
        }>
            {
                isAuth &&
                    <Modal active={modalActive} setActive={setModal}>
                        <div className="flex justify-between items-center">
                            <h3 className="heading--tertiary">Связаться с организатором</h3>
                            <Button className="text-gray p-0" onClick={() => setModal(false)}><i className="fa-solid fa-xmark text-3xl w-8 h-8"></i></Button>
                        </div>
                        <form onSubmit={questionForm.onSubmit} onChange={questionForm.onChange}>
                            <div className="w-80">
                                <FormInput name="name" data={defaultFormInputData("Ваше имя")} serverError={questionForm.serverErrors["name"]} isSubmitted={questionForm.isSubmitted} callBack={questionForm.updateInputStatuses} />
                            </div>
                            <div className="w-80">
                                <FormInput name="email" data={defaultFormInputData("Ваш email")} serverError={questionForm.serverErrors["email"]} isSubmitted={questionForm.isSubmitted} callBack={questionForm.updateInputStatuses} />
                            </div>
                            <Textarea name="question" className="h-60" label="Текст сообщения:" minLength={50} serverError={questionForm.serverErrors["question"]} isSubmitted={questionForm.isSubmitted} callBack={questionForm.updateInputStatuses} />
                            <div className="flex justify-end items-center gap-2">
                                <Button onClick={() => setModal(false)}>
                                    <div className="text-gray">Отмена</div>
                                </Button>
                                <SubmitButton disabled={questionForm.hasError} isPrimary={true} 
                                    buttonStyle={questionForm.hasError ? ButtonStyles.BUTTON_RED : ButtonStyles.BUTTON_GREEN}>
                                    Отправить
                                </SubmitButton>
                            </div>
                        </form>
                    </Modal>
            }
            <div className="m-auto max-w-2xl flex flex-wrap justify-center items-center gap-3 mt-2">
                <WithIcon icon={<i className="fa-solid fa-calendar"></i>}>
                    {event.date}
                </WithIcon>
                <Location type={event.type} location={event.location} />
            </div>
            <div className="flex justify-center items-center gap-4 py-4 relative">
                <div className="flex flex-col justify-center items-start gap-4">
                    <div className="w-[44rem] h-[25rem] relative bg-lightgray rounded-md">
                        {
                            event.coverUrl && <img src={event.coverUrl} alt={event.title} />
                        }
                    </div>
                    <WithIcon icon={<i className="fa-solid fa-tags"></i>}>
                        Категория
                    </WithIcon>
                </div>
                <div className="w-full h-full flex flex-col justify-center items-center gap-2">
                    <div className="relative px-4 pt-[4.25rem] pb-6 w-72 flex flex-col justify-center items-center border-2 border-lightgray rounded-md">
                        <div className="absolute -top-1/2 translate-y-1/2 w-28 h-28 bg-lightgray rounded-full border-4 border-white"></div>
                        <h3 className="text-2xl text-center">
                            {event.creator.name}
                        </h3>
                        <div className="text-base">
                            {event.creator.eventsCount} мероприятий
                        </div>
                        <div className="flex justify-center items-center gap-1 text-base">
                            <span className="font-medium">{event.creator.rating}</span>
                            <i className="fa-solid fa-star text-yellow"></i>
                        </div>
                    </div>
                    {
                        isAuth &&
                            <Button buttonStyle={ButtonStyles.BUTTON_BLUE} onClick={() => setModal(true)} >
                                <WithIcon icon={<i className="fa-regular fa-circle-question"></i>}>
                                    <span className="text-base">Связаться с организатором</span>
                                </WithIcon>
                            </Button>
                    }
                </div>
            </div>
            <div className="flex flex-col gap-8">
                <div className="text-base whitespace-pre-wrap">
                    {event.fullDescription}
                </div>
                {
                    isAuth &&
                    <div className="m-auto">
                        <h3 className="heading--tertiary mb-2">Регистрация</h3>
                        <form onSubmit={onSubmit} onChange={onChange}>
                            <div className="flex gap-8 pb-2">
                                <div className="w-80 max-w-xs">
                                    {
                                        event.questions.map(({name: text}) => <FormInput
                                            key={text} 
                                            name={text}
                                            data={defaultFormInputData(text)}
                                            serverError={serverErrors[text]}
                                            isSubmitted={isSubmitted}
                                            callBack={updateInputStatuses}
                                        />)
                                    }
                                </div>
                                <div className="min-w-[20rem] max-w-sm">
                                    <div className="flex justify-between font-bold pb-5">
                                        <div>Название билета</div>
                                        <div className="w-24 text-center">Цена</div>
                                    </div>
                                    <ul>
                                        {
                                            event.tickets.map(({id, name, until, price}, i) => 
                                                <RadioButton key={name} name="tickets" id={name} value={id} defaultChecked={i === 0} callBack={updateInputStatuses}>
                                                    <div className="flex justify-between gap-4">
                                                        <div className="w-60">
                                                                <div className="font-ubuntu font-semibold overflow-hidden text-ellipsis whitespace-nowrap">{name}</div>
                                                                <div className="text-sm">до {until}</div>
                                                            </div>
                                                            <div className="w-24 text-center">
                                                                {
                                                                    price
                                                                    ?
                                                                        <div><span className="font-bold">{price}</span> руб.</div>
                                                                    :
                                                                    <span className="font-bold">Бесплатно</span>
                                                                }
                                                            </div>
                                                    </div>
                                                </RadioButton>
                                            )
                                        }
                                    </ul>
                                </div>
                            </div>
                            <SubmitButton disabled={hasError} isPrimary={true} 
                                buttonStyle={hasError ? ButtonStyles.BUTTON_RED : ButtonStyles.BUTTON_GREEN}>
                                {
                                    event.tickets.find((t) => t.id === getInputStatus("tickets")?.value)?.price
                                    ?
                                    "Купить билет"
                                    :
                                    "Зарегистрироваться"
                                }
                            </SubmitButton>
                        </form>
                    </div>
                }
            </div>
        </PageLayout>
    );
}
