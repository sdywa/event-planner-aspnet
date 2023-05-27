import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Map, TileLayer } from "leaflet";

import { IAddress } from "../types/Api";

const MapSettings = {
    TILE_LAYER:
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    ATTRIBUTION:
        // eslint-disable-next-line prettier/prettier
        "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors &copy; <a href=\"https://carto.com/attributions\">CARTO</a>",
};

const customZoom: { [key: string]: number } = {
    region: 8,
    city: 12,
    street: 14,
    house: 16,
};

export const useMap = (
    mapRef: MutableRefObject<HTMLElement | null>,
    address: IAddress
): Map | null => {
    const [map, setMap] = useState<Map | null>(null);
    const isRenderedRef = useRef<boolean>(false);

    function getZoom() {
        let zoom = 0;
        for (const k in address)
            if (address[k as keyof IAddress] && k in customZoom)
                zoom = Math.max(customZoom[k], zoom);
        console.log(zoom);
        return zoom;
    }

    useEffect(() => {
        if (mapRef.current !== null && !isRenderedRef.current) {
            const instance = new Map(mapRef.current, {
                center: {
                    lat: address.latitude,
                    lng: address.longitude,
                },
                zoom: getZoom(),
            });

            const layer = new TileLayer(MapSettings.TILE_LAYER, {
                attribution: MapSettings.ATTRIBUTION,
            });

            instance.addLayer(layer);

            setMap(instance);
            isRenderedRef.current = true;
        }
    }, [mapRef, map, address]);

    return map;
};
