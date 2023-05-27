import React, { FC, useState } from "react";

import { useDebounce } from "../../../hooks/useDebounce";
import { IS_FAVORITE } from "../../../hooks/useFilter";
import { IFilter } from "../../../types";
import { IEventResponse } from "../../../types/Api";
import { ActionButton } from "../buttons/ActionButton";
import { Input, InputStyle } from "../inputs/Input";

interface IEventSearchProps {
    isAuth: boolean;
    setSearchText: (value: string) => void;
    showingFilterCallback: (value: boolean) => void;
    filtersCallback: (value: IFilter<IEventResponse>, force: boolean) => void;
}

export const Search: FC<IEventSearchProps> = ({
    isAuth,
    setSearchText,
    showingFilterCallback,
    filtersCallback,
}) => {
    const [value, setValue] = useState("");
    const [showingFilter, setFilter] = useState(false);
    const [showingFavorite, setFavorite] = useState(false);
    const debouncedSearch = useDebounce(search, 500);

    function search(query: string) {
        setSearchText(query.trim());
    }

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value);
        debouncedSearch(e.target.value);
    }

    function onFilterClick(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        showingFilterCallback(!showingFilter);
        setFilter(!showingFilter);
    }

    function onFavoriteClick(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        filtersCallback(IS_FAVORITE(), !showingFavorite);
        setFavorite(!showingFavorite);
    }

    return (
        <div className="w-[35rem] flex justify-center items-center gap-4">
            <Input
                type="text"
                name="search"
                className={"pl-8"}
                value={value}
                style={InputStyle.WITH_ICON}
                onChange={onChange}
                placeholder="Поиск"
                autoComplete="off"
            >
                <i className="fa-solid fa-magnifying-glass"></i>
            </Input>
            <div className="flex justify-center items-center gap-2">
                <ActionButton isShowing={showingFilter} onClick={onFilterClick}>
                    <i className="fa-solid fa-filter"></i>
                </ActionButton>
                {isAuth && (
                    <ActionButton
                        isShowing={showingFavorite}
                        onClick={onFavoriteClick}
                    >
                        <i className="fa-solid fa-bookmark"></i>
                    </ActionButton>
                )}
            </div>
        </div>
    );
};
