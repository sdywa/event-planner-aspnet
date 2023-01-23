import { FC, useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import { Input } from "../input/Input";
import "./Search.css";

interface ISearchProps {
    searchUrl: string;
};

export const Search: FC<ISearchProps> = ({searchUrl: string}) => {
    const [value, setValue] = useState("");
    const debouncedSearch = useDebounce<string>(search, 500);

    function search(query: string) {
        console.log(`searching... ${query}`);
    }

    function onChange (e: React.ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value);
        debouncedSearch(e.target.value);
    }

    return (
        <div className="search input-box-inner">
            <Input type="text" name="search" value={value} onChange={onChange} 
                icon={<i className="fa-solid fa-magnifying-glass"></i>} placeholder="Поиск"/>
        </div>
    );
}
