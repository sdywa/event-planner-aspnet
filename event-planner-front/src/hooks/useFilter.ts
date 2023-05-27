import { useEffect, useState } from "react";

import { IEventResponse } from "../types/Api";
import { IFilter } from "../types/index";

export const IS_FAVORITE: () => IFilter<IEventResponse> = () => {
    return {
        name: "isFavorite",
        func: (value) => value.isFavorite,
    };
};

export const BY_CATEGORY: (category?: number) => IFilter<IEventResponse> = (
    category?: number
) => {
    return {
        name: "byCategory",
        func: (value) => value.category.id === category,
    };
};

export function useFilter<T>(items: T[]) {
    const [filters, setFilters] = useState<IFilter<T>[]>([]);
    const [filteredItems, setFilteredItems] = useState(items);

    const toggleFilter = (filter: IFilter<T>, force: boolean) => {
        if (!force)
            setFilters((filters) =>
                filters.filter((x) => x.name !== filter.name)
            );
        else setFilters((filters) => [...filters, filter]);
    };

    useEffect(() => {
        let tempItems = items;
        for (const filter of filters) {
            tempItems = tempItems.filter(filter.func);
        }
        setFilteredItems(tempItems);
    }, [items, filters]);

    return { filteredItems, toggleFilter };
}
