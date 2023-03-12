import { FC, useEffect } from "react";
import { IFilter } from "../../../../types";
import { IEventResponse } from "../../../../types/Api";
import { Select } from "../../inputs/select/Select";
import { IFormInputStatus } from "../../../../types";
import { BY_CATEGORY } from "../../../../hooks/useFilter";

interface IEventFilterProps {
    filtersCallback: (value: IFilter<IEventResponse>, force: boolean) => void;
    [props:string]: any
};

export const EventFilter: FC<IEventFilterProps> = ({filtersCallback, ...props}) => {
    const categories = [
        { id: 0, name: "All", title: "Выберите категорию" },
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
        { id: 12, name: "OtherEntertaiment", title: "Другие развлечения" }
    ];

    const categoryCallback = (name: string, value: IFormInputStatus) => {
        if (value.value) {
            filtersCallback(BY_CATEGORY(), false);
            filtersCallback(BY_CATEGORY(value.value), true);
        } else if (value.value === 0)
            filtersCallback(BY_CATEGORY(), false);
    }

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        return () => filtersCallback(BY_CATEGORY(), false);
    }, []);

    return (
        <div {...props}>
            <div className="w-52">
                <Select name="category" serverError={""} defaultValue={categories[0].id} options={categories.map(({id, title}) => ({value: id, title}))} isFormSubmitted={false} callBack={categoryCallback} />
            </div>
        </div>
    );
}
