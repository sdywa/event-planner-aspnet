import api from "..";
import { IEventResponse } from "../../types/Api";

const EventService = {
    getAll: async () => 
        api.get<IEventResponse[]>("event"),
    setFavorite: async (id: Number, data: {isFavorite: boolean}) =>
        api.post(`/event/${id}/fav`, data),
    search: async (params: {search: string}) =>
        api.get<IEventResponse[]>("/event/search", {params: params}),
    createEvent: async (data: {title: string, description: string, fullDescription: string, cover?: File, startDate?: string, endDate?: string, typeId: number, categoryId: number, address?: string}) => {
        const formData = new FormData();
        let key: keyof typeof data;
        for (key in data) {
            let value = data[key]!;
            if (typeof value === "number")
                value = value.toString();
            formData.append(key, value);
        }   
        return api.post<{id: number}>("/event/new", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
        }})
    },
    get: async (id: number) => 
        api.get(`/event/${id}`)
}

export default EventService;
