import api from "..";
import { IEventResponse } from "../../types/Api";

const EventService = {
    getAll: async () => 
        api.get<IEventResponse[]>("event")
}

export default EventService;
