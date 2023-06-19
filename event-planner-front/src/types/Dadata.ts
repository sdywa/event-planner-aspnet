export interface IAddressResponse {
    data: {
        geo_lat: string;
        geo_lon: string;
        region: string;
        city: string;
        street: string;
        house: string;
        block?: string;
    };
    value: string;
}
