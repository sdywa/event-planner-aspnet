import React, { FC, useEffect, useRef } from "react";
import { Icon, Marker } from "leaflet";

import { useMap } from "../../hooks/useMap";
import { IAddress } from "../../types/Api";

import "leaflet/dist/leaflet.css";

interface IMapProps {
    address: IAddress;
    [key: string]: unknown;
}

const currentCustomIcon = new Icon({
    iconUrl: "/img/pin.svg",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

export const Map: FC<IMapProps> = ({ address, ...props }) => {
    const mapRef = useRef(null);
    const map = useMap(mapRef, address);

    useEffect(() => {
        let marker: Marker;

        if (map) {
            const pos = {
                lat: address.latitude,
                lng: address.longitude,
            };
            marker = new Marker(pos);
            marker.setIcon(currentCustomIcon).addTo(map);
            map.setView(pos);
        }

        return () => {
            if (map) {
                map.removeLayer(marker);
            }
        };
    }, [map, address]);

    return <section className="w-full rounded-xl" ref={mapRef} {...props} />;
};
