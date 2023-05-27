import { IChat } from "../../types/Api";
import { api } from "..";

export const ChatService = {
    getChat: async (id: number) => api.get<IChat>(`/chat/${id}`),
    sendMessage: async (
        id: number,
        data: { text: string; closeChat: boolean }
    ) => api.post<IChat>(`/chat/${id}`, data),
};
