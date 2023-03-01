import api from "..";
import { IEventQuestion, IEventResponse } from "../../types/Api";

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
        return api.post<{id: number}>("/event/new", formData);
    },
    updateEvent: async (id: number, data: {title: string, description: string, fullDescription: string, cover?: File, startDate?: string, endDate?: string, typeId: number, categoryId: number, address?: string}) => {
        const formData = new FormData();
        formData.append("id", id.toString());
        let key: keyof typeof data;
        for (key in data) {
            let value = data[key]!;
            if (typeof value === "number")
                value = value.toString();
            formData.append(key, value);
        }   
        return api.patch(`/event/${id}`, formData);
    },
    get: async (id: number) => 
        api.get(`/event/${id}`),
    getQuestions: async (id: number) =>
        api.get<IEventQuestion[]>(`/event/${id}/questions`),
    sendQuestions: async (id: number, questions: IEventQuestion[]) => 
        api.post(`/event/${id}/questions`, questions),
}

export default EventService;
