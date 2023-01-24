import { FC, useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import { Input } from "../input/Input";

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
        <div className="w-[35rem]">
            <Input type="text" name="search" value={value} onChange={onChange} 
                icon={<i className="fa-solid fa-magnifying-glass"></i>} placeholder="Поиск"/>
        </div>
    );
}
