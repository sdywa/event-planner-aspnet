import { FC, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageLayout } from "../../components/layouts/page-layout/PageLayout";
import { List } from "../../components/UI/list/List";
import { ListItem } from "../../components/UI/list/ListItem";
import useForm from "../../hooks/forms/useForm";
import { IExtendedEvent, IFormInputStatus, IFormInputData, IServerError } from "../../types";
import { FormInput } from "../../components/UI/forms/form-input/FormInput";
import { Textarea } from "../../components/UI/inputs/textarea/Textarea";
import { Select } from "../../components/UI/inputs/select/Select";
import { Button, ButtonStyles } from "../../components/UI/button/Button";
import { DateTimeInput } from "../../components/UI/inputs/DateTimeInput";
import { SubmitButton } from "../../components/UI/button/SubmitButton";
import { FileUpload, AcceptedTypes } from "../../components/UI/inputs/FileUpload";
import { IS_NOT_EMPTY, MIN_LENGTH, MAX_LENGTH } from "../../hooks/useValidation";

export const EditEvent: FC = () => {
    const navigate = useNavigate();
    const {eventId} = useParams();
    const [event, setEvent] = useState<IExtendedEvent>();

    const data: { [key: string]: IFormInputData } = {
        title: {
            label: "Название",
            type: "text",
            autoComplete: "off",
            validation: [IS_NOT_EMPTY("Укажите название"), MIN_LENGTH(3), MAX_LENGTH(50)]
        },
        address: {
            label: "Адрес",
            type: "text",
            autoComplete: "off",
            validation: [IS_NOT_EMPTY("Укажите адрес"), MIN_LENGTH(3), MAX_LENGTH(100)]
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
        { id: 10, name: "Concert", title: "Концентры" },
        { id: 11, name: "Other", title: "Другие события" },
        { id: 12, name: "OtherEntertaiment", title: "Другие развлечения" }
    ];

    const eventType = [
        { id: 1, name: "Offline", title: "Офлайн" },
        { id: 2, name: "Online", title: "Онлайн" }
    ];

    function sendFormData(data: {[key: string]: IFormInputStatus}): IServerError {
        console.log("sent!");
        navigate("/events/1/questions");
        return {};
    }

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        if (eventId) {
            // Sending request to server
            setEvent({
                title: "Заголовок",
                cover: "",
                description: "Описание мероприятия описание описание описание описание",
                fullDescription: `    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sit amet convallis velit. Curabitur varius bibendum ornare. Vestibulum vitae vestibulum lorem. Duis molestie nunc vel mollis molestie. Nullam feugiat tortor eu lacus molestie, nec efficitur lectus finibus. Cras neque ipsum, tempus eget mi a, imperdiet tempus turpis. Vestibulum ac nisi vitae est volutpat finibus. Fusce sagittis magna in ipsum egestas vehicula. Sed mollis tincidunt felis vel mollis. Aliquam ut lectus vel dui auctor congue quis vitae tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
        
            Maecenas viverra, lacus a pellentesque aliquet, lacus justo pretium nunc, et rutrum turpis justo et lorem. Morbi sem risus, feugiat eu interdum ac, sollicitudin quis libero. Duis et maximus lectus. Cras porta fringilla nisl, a euismod tortor imperdiet at. Nullam posuere dapibus velit. Praesent at risus sit amet magna pellentesque sollicitudin eu nec justo. Pellentesque sit amet eros at mauris consequat cursus. Curabitur at odio et quam hendrerit accumsan sed ultrices purus. Vestibulum sagittis rutrum efficitur. Vivamus pharetra vel mi ut scelerisque. Phasellus sagittis laoreet erat, sed faucibus purus lacinia at. Sed convallis facilisis eros ac vehicula. Curabitur sit amet accumsan neque, ac viverra lectus. Duis ut libero nec eros scelerisque bibendum tincidunt non lorem. Nullam sed neque tortor.
                
            Nulla faucibus et mauris vitae pharetra. Vestibulum aliquam pulvinar augue, eu molestie sapien finibus vel. Proin consequat, massa et vestibulum tempus, velit leo tincidunt ante, eu aliquet erat lectus id nibh. Cras magna leo, convallis et mauris ut, ullamcorper porttitor augue. Nullam vitae est sed sem porttitor pharetra sed eget odio. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris ut quam eu orci feugiat pellentesque et sed neque. In hac habitasse platea dictumst. Praesent dapibus non purus condimentum iaculis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed iaculis varius placerat. Ut nulla erat, eleifend vitae diam et, porttitor tempor nunc.`,
                category: {
                    id: 1,
                    title: "Бизнес"
                },
                type: {
                    id: 1,
                    title: "Оффлайн"
                },
                startDate: "2023-03-17T13:40:00.000Z",
                endDate: "2023-03-17T15:00:00.000Z",
                address: "г. Москва, очень длинный адрес который может не поместиться в одну строку"
            });
        }
    }, []);

    useEffect(() => {
        infoForm.hideInputStatus("address", infoForm.getInputStatus("type")?.value !== eventType[0].id);
        //infoForm.getInputStatus("type")?.value !== eventType[0].id
    }, [infoForm.getInputStatus("type")]);

    return (
        <PageLayout title="Новое мероприятие">
            <div className="flex gap-12">
                <List className="w-48 text-black">
                    <ListItem className="text-green">Информация</ListItem>
                    <ListItem link={event && `/events/${eventId}/questions`} className={["text-darkgray hover:text-gray", !event ? "text-lightgray pointer-events-none" : ""]}>Анкета</ListItem>
                    <ListItem link={event && `/events/${eventId}/tickets`} className={["text-darkgray hover:text-gray", !event ? "text-lightgray pointer-events-none" : ""]}>Билеты</ListItem>
                </List>
                <form className="w-full flex flex-col gap-8" onSubmit={infoForm.onSubmit} onChange={infoForm.onChange}>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <h3 className="text-2xl">Основное</h3>
                            <div className="w-96">
                                <FormInput initialValue={event?.title} name="title" data={data.title} serverError={infoForm.serverErrors["title"]} isSubmitted={infoForm.isSubmitted} callBack={infoForm.updateInputStatuses} />
                            </div>
                            <Textarea initialValue={event?.description} name="description" label="Краткое описание:" minLength={50} maxLength={250} className="h-20" serverError={infoForm.serverErrors["description"]} isSubmitted={infoForm.isSubmitted} callBack={infoForm.updateInputStatuses} additionalText="Краткое описание будет отображаться на странице списка мероприятий"/>
                            <Textarea initialValue={event?.fullDescription} name="fullDescription" label="Подробное описание:" minLength={200} className="h-60" serverError={infoForm.serverErrors["fullDescription"]} isSubmitted={infoForm.isSubmitted} callBack={infoForm.updateInputStatuses} additionalText="Подробное описание будет показываться на страничке мероприятия"/>
                        </div>
                        <div>
                            <div>
                                <span className="font-medium">Начало мероприятия:</span>
                                <div className="flex gap-2 font-roboto text-sm">
                                    <DateTimeInput initialValue={event?.startDate} name="startDate" serverError={infoForm.serverErrors["startDate"]} isFormSubmitted={infoForm.isSubmitted} callBack={infoForm.updateInputStatuses} />
                                    <span className="p-2">—</span>
                                    <DateTimeInput initialValue={event?.endDate} name="endDate" serverError={infoForm.serverErrors["endDate"]} isFormSubmitted={infoForm.isSubmitted} callBack={infoForm.updateInputStatuses} />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium">Категория:</span>
                                <div className="w-52">
                                    <Select name="category" defaultValue={event ? event.category.id : "Выберите категорию"} serverError={infoForm.serverErrors["category"]} options={categories.map(({id, title}) => ({value: id, title}))} isFormSubmitted={infoForm.isSubmitted} callBack={infoForm.updateInputStatuses} />
                                </div>
                            </div>
                            <div>
                                <span className="font-medium">Обложка:</span>
                                <FileUpload name="cover" title="Выбрать изображение" acceptedType={AcceptedTypes.IMAGES} serverError={infoForm.serverErrors["cover"]} isFormSubmitted={infoForm.isSubmitted} callBack={infoForm.updateInputStatuses} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-2xl mb-2">Расположение</h3>
                        <div className="flex flex-col">
                            <span className="font-medium">Тип:</span>
                            <div className="w-32">
                                <Select name="type" defaultValue={event ? event.type.id : eventType[0].id} serverError={infoForm.serverErrors["type"]} options={eventType.map(({id, title}) => ({value: id, title}))} isFormSubmitted={infoForm.isSubmitted} callBack={infoForm.updateInputStatuses} />
                            </div>
                        </div>
                        {
                            infoForm.getInputStatus("type")?.value === eventType[0].id &&
                            <div className="flex flex-col">
                                <div className="mx-2">
                                    <FormInput initialValue={event?.address} name="address" data={data.address} serverError={infoForm.serverErrors["address"]} isSubmitted={infoForm.isSubmitted} callBack={infoForm.updateInputStatuses} />
                                </div>
                                <div className="w-full h-96 bg-lightgray rounded-md"></div>
                            </div>
                        }
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-6">
                            <SubmitButton disabled={infoForm.hasError} isPrimary={true} 
                                buttonStyle={infoForm.hasError ? ButtonStyles.BUTTON_RED : ButtonStyles.BUTTON_GREEN}>
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
        </PageLayout>
    );
}
