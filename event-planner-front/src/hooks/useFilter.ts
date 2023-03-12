import { useState, useEffect } from "react";
import { IFilter } from "../types/index";
import { IEventResponse } from "../types/Api";

export const IS_FAVORITE: () => IFilter<IEventResponse> = () => {
    return {
        name: "isFavorite",
        func: (value) => value.isFavorite
    }
};

export const BY_CATEGORY: (category?: number) => IFilter<IEventResponse> = (category?: number) => {
    return {
        name: "byCategory",
        func: (value) => value.category.id === category
    }
};

function useFilter<T>(items: T[]) {
    const [filters, setFilters] = useState<IFilter<T>[]>([]);
    const [filteredItems, setFilteredItems] = useState(items);

    const toggleFilter = (filter: IFilter<T>, force: boolean) => {
        if (!force)
            setFilters(filters => filters.filter(x => x.name !== filter.name));
        else
            setFilters(filters => [...filters, filter]);
    }

    useEffect(() => {
        let tempItems = items;
        for (const filter of filters) {
            tempItems = tempItems.filter(filter.func);
        }
        setFilteredItems(tempItems);
    }, [items, filters]);

    return { filteredItems, toggleFilter };
};

export default useFilter;
