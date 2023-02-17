import { FC } from "react";
import { PageLayout } from "../../components/layouts/page-layout/PageLayout";
import { List } from "../../components/UI/list/List";
import { ListItem } from "../../components/UI/list/ListItem";
import useForm from "../../hooks/forms/useForm";
import { IFormInputStatus, IFormInputData, IServerError } from "../../types";
import { FormInput } from "../../components/UI/forms/form-input/FormInput";
import { Textarea } from "../../components/UI/inputs/textarea/Textarea";
import { Select } from "../../components/UI/inputs/select/Select";
import { Button, ButtonStyles } from "../../components/UI/button/Button";
import { DateTimeInput } from "../../components/UI/inputs/DateTimeInput";
import { SubmitButton } from "../../components/UI/button/SubmitButton";
import { FileUpload, AcceptedTypes } from "../../components/UI/inputs/FileUpload";
import { IS_NOT_EMPTY, MIN_LENGTH, MAX_LENGTH } from "../../hooks/useValidation";

export const NewEvent: FC = () => {
    const data: { [key: string]: IFormInputData } = {
        name: {
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
    ]

    function sendFormData(data: {[key: string]: IFormInputStatus}): IServerError {
        console.log("sent!");
        return {};
    }

    // TODO: доделать ответ сервера в datatimeinput
    return (
        <PageLayout title="Новое мероприятие">
            <div className="flex gap-12">
                <List className="w-48 text-black">
                    <ListItem className="text-green">Информация</ListItem>
                    <ListItem className="hover:text-darkgray">Анкета</ListItem>
                    <ListItem className="hover:text-darkgray">Билеты</ListItem>
                </List>
                <form className="w-full flex flex-col gap-8" onSubmit={infoForm.onSubmit} onChange={infoForm.onChange}>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <h3 className="text-2xl">Основное</h3>
                            <div className="w-96">
                                <FormInput name="name" data={data.name} serverError={infoForm.serverErrors["name"]} isSubmitted={infoForm.isSubmitted} callBack={infoForm.updateInputStatuses} />
                            </div>
                            <Textarea name="shortDescription" label="Краткое описание:" minLength={50} maxLength={250} className="h-20" serverError={infoForm.serverErrors["shortDescription"]} isSubmitted={infoForm.isSubmitted} callBack={infoForm.updateInputStatuses} additionalText="Краткое описание будет отображаться на странице списка мероприятий"/>
                            <Textarea name="description" label="Подробное описание:" minLength={200} className="h-60" serverError={infoForm.serverErrors["description"]} isSubmitted={infoForm.isSubmitted} callBack={infoForm.updateInputStatuses} additionalText="Подробное описание будет показываться на страничке мероприятия"/>
                        </div>
                        <div>
                            <div>
                                <span className="font-medium">Начало мероприятия:</span>
                                <div className="flex gap-2 font-roboto text-sm">
                                    <DateTimeInput name="start-date" serverError="a" isFormSubmitted={infoForm.isSubmitted} callBack={infoForm.updateInputStatuses} />
                                    <span className="p-2">—</span>
                                    <DateTimeInput name="end-date" serverError="a" isFormSubmitted={infoForm.isSubmitted} callBack={infoForm.updateInputStatuses} />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium">Категория:</span>
                                <div className="w-52">
                                    <Select name="category" defaultValue="Выберите категорию" options={categories.map(({id, title}) => ({value: id.toString(), title}))} isFormSubmitted={infoForm.isSubmitted} callBack={infoForm.updateInputStatuses} />
                                </div>
                            </div>
                            <div>
                                <span className="font-medium">Обложка:</span>
                                <FileUpload name="cover" title="Выбрать изображение" acceptedType={AcceptedTypes.IMAGES} serverError="a" isFormSubmitted={infoForm.isSubmitted} callBack={infoForm.updateInputStatuses} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-2xl mb-2">Расположение</h3>
                        <div className="flex flex-col">
                            <span className="font-medium">Тип:</span>
                            <div className="w-32">
                                <Select name="type" defaultValue={eventType[0].id.toString()} options={eventType.map(({id, title}) => ({value: id.toString(), title}))} isFormSubmitted={infoForm.isSubmitted} callBack={infoForm.updateInputStatuses} />
                            </div>
                        </div>
                        {
                            infoForm.getInputStatus("type")?.value === eventType[0].id.toString() &&
                            <div className="flex flex-col">
                                <div className="mx-2">
                                    <FormInput name="address" data={data.address} serverError={infoForm.serverErrors["address"]} isSubmitted={infoForm.isSubmitted} callBack={infoForm.updateInputStatuses} />
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
