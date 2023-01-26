import { useState, useEffect } from "react";
import { IEvent, IFilter } from "../types/index";

export const IS_FAVORITE: IFilter<IEvent> = {
    name: "isFavorite",
    func: (value) => value.isFavorite
};

function useFilter<T>(items: T[]) {
    const [filters, setFilters] = useState<IFilter<T>[]>([]);
    const [filteredItems, setFilteredItems] = useState(items);

    const toggleFilter = (filter: IFilter<T>) => {
        if (filters.includes(filter))
            setFilters(filters.filter(x => x.name !== filter.name));
        else
            setFilters([...filters, filter]);
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