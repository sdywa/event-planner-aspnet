import api from "..";
import { IEventResponse } from "../../types/Api";

const EventService = {
    getAll: async () => 
        api.get<IEventResponse[]>("event"),
    setFavorite: async (id: Number, data: {isFavorite: boolean}) =>
        api.post(`/event/${id}/fav`, data),
    search: async (params: {search: string}) =>
        api.get<IEventResponse[]>("/event/search", {params: params})
}

export default EventService;
