import axios from "axios";

import { IAddressResponse } from "../../types/Dadata";

const token = "de9771c0ae0b44da101faf30a2953d59fccf5b96";

export const DadataService = {
    suggest: async (query: string, count = 5) => {
        const url =
            "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
        const config = {
            url: url,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Token " + token,
            },
            data: {
                query: query,
                count: count,
                to_bound: {
                    value: "house",
                },
            },
        };

        return axios<{ suggestions: IAddressResponse[] }>(config);
    },
};
