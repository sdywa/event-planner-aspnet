import api from "..";
import { IChat } from "../../types/Api";

const ChatService = {
    getChat: async (id: number) =>
        api.get<IChat>(`/chat/${id}`),
}

export default ChatService;
