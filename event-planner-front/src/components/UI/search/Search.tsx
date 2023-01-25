import React, { FC, useState } from "react";
import { clsx } from "clsx";
import useDebounce from "../../../hooks/useDebounce";
import { Input } from "../input/Input";
import { Button, ButtonStyles } from "../button/Button";

interface ISearchProps {
    searchUrl: string;
};

export const Search: FC<ISearchProps> = ({searchUrl: string}) => {
    const [value, setValue] = useState("");
    const [showingFilter, setFilter] = useState(false);
    const [showingFavorite, setFavorite] = useState(false);
    const debouncedSearch = useDebounce<string>(search, 500);

    function search(query: string) {
        console.log(`searching... ${query}`);
    }

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value);
        debouncedSearch(e.target.value);
    }

    function onFilterClick(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        setFilter(!showingFilter);
    }

    function onFavoriteClick(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        setFavorite(!showingFavorite);
    }

    return (
        <div className="w-[35rem] flex justify-center items-center gap-4">
            <Input type="text" name="search" value={value} onChange={onChange} 
                icon={<i className="fa-solid fa-magnifying-glass"></i>} placeholder="Поиск" autocomplete="off"/>
            <div className="flex justify-center items-center gap-2">
                <Button className={["button w-8 h-8 p-0 flex justify-center items-center text-lg border-2 rounded-md", showingFilter ? "button--green" : "text-gray border-gray hover:border-darkgray"]} onClick={onFilterClick}>
                    <i className="fa-solid fa-filter"></i>
                </Button>
                <Button className={["button w-8 h-8 p-0 flex justify-center items-center text-lg border-2 rounded-md", showingFavorite ? "button--green" : "text-gray border-gray hover:border-darkgray"]} onClick={onFavoriteClick}>
                    <i className="fa-solid fa-bookmark"></i>
                </Button>
            </div>
        </div>
    );
}
