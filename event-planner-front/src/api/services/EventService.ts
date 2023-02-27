import api from "..";
import { IEventResponse } from "../../types/Api";

const EventService = {
    getAll: async () => 
        api.get<IEventResponse[]>("event"),
    setFavorite: async (id: Number, data: {isFavorite: boolean}) =>
        api.post(`/event/${id}/fav`, data)
}

export default EventService;
