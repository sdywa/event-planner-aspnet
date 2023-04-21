import api from "..";
import { IEventQuestion, IEventQuestionResponse, IEventTicket, IEventTicketResponse, IParticipationModel } from "../../types/Api";

const EventService = {
    getAll: async <T>() =>
        api.get<T>("event"),
    setFavorite: async (id: Number, data: {isFavorite: boolean}) =>
        api.post(`/event/${id}/fav`, data),
    search: async <T>(params: {search: string}) =>
        api.get<T[]>("/event/search", {params: params}),
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
    deleteEvent: async (id: number) =>
        api.delete(`/event/${id}`),
    get: async <T>(id: number) =>
        api.get<T>(`/event/${id}`),
    getQuestions: async (id: number) =>
        api.get<IEventQuestionResponse>(`/event/${id}/questions`),
    sendQuestions: async (id: number, questions: IEventQuestion[]) =>
        api.post(`/event/${id}/questions`, questions),
    getTickets: async (id: number) =>
        api.get<IEventTicketResponse>(`/event/${id}/tickets`),
    sendTickets: async (id: number, tickets: IEventTicket[]) =>
        api.post(`/event/${id}/tickets`, tickets),
    participate: async (id: number, participation: IParticipationModel) =>
        api.post(`/event/${id}/participate`, participation),
    makeReview: async (id: number, data: { rating: number, text?: string}) =>
        api.post(`/event/${id}/review`, data)
}

export default EventService;
