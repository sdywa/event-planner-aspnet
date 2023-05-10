import api from "..";
import { IEventQuestion, IEventQuestionResponse, IEventTicket, IEventTicketResponse, IParticipationModel, IEventStatisticsResponse, IEventParticipantsResponse, IEventChatResponse } from "../../types/Api";

function addData(form: FormData, value: any, key='') {
    if (typeof value === "object") {
        for (const k in value) {
            addData(form, value[k], key ? `${key}[${k}]` : k);
        }
        return;
    }

    if (typeof value === "number")
        value = value.toString();

    form.append(key, value);
    console.log(`append: ${key} ${value}`);
}

const EventService = {
    getAll: async <T>() =>
        api.get<T>("event"),
    setFavorite: async (id: Number, data: {isFavorite: boolean}) =>
        api.post(`/event/${id}/fav`, data),
    search: async <T>(params: {search: string}) =>
        api.get<T[]>("/event/search", {params: params}),
    createEvent: async (data: {title: string, description: string, fullDescription: string, cover?: File, startDate?: string, endDate?: string, typeId: number, categoryId: number, address?: string}) => {
        const formData = new FormData();
        addData(formData, data);
        return api.post<{id: number}>("/event/new", formData);
    },
    updateEvent: async (id: number, data: {title: string, description: string, fullDescription: string, cover?: File, startDate?: string, endDate?: string, typeId: number, categoryId: number, address?: string}) => {
        const formData = new FormData();
        formData.append("id", id.toString());
        addData(formData, data);
        return api.patch(`/event/${id}`, formData);
    },
    deleteEvent: async (id: number) =>
        api.delete(`/event/${id}`),
    get: async <T>(id: number) =>
        api.get<T>(`/event/${id}`),
    getQuestions: async (id: number) =>
        api.get<IEventQuestionResponse>(`/event/${id}/questions`),
    sendQuestions: async (id: number, questions: IEventQuestion[]) =>
        api.post(`/event/${id}/questions`, { questions }),
    getTickets: async (id: number) =>
        api.get<IEventTicketResponse>(`/event/${id}/tickets`),
    sendTickets: async (id: number, tickets: IEventTicket[]) =>
        api.post(`/event/${id}/tickets`, { tickets }),
    getStatistics: async (id: number) =>
        api.get<IEventStatisticsResponse>(`/event/${id}/statistics`),
    getParticipants: async (id: number) =>
        api.get<IEventParticipantsResponse>(`/event/${id}/participants`),
    deleteParticipant: async (id: number, userId: number) =>
        api.delete<IEventParticipantsResponse>(`/event/${id}/participants/${userId}`),
    getChats: async (id: number) =>
        api.get<IEventChatResponse>(`/event/${id}/chats`),
    createChat: async (id: number, data: { theme: string, text: string }) =>
        api.post(`/event/${id}/chats`, data),
    participate: async (id: number, participation: IParticipationModel) =>
        api.post(`/event/${id}/participate`, participation),
    makeReview: async (id: number, data: { rating: number, text?: string}) =>
        api.post(`/event/${id}/review`, data)
}

export default EventService;
