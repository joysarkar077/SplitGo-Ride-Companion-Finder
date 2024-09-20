'use client';
// RideListingMap.tsx (Component for rendering origin and destination in ride list)
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { LatLng } from 'leaflet';  // Import LatLng from leaflet

import L from 'leaflet';

const markerIcon = new L.Icon({
    iconUrl: '/map-pin.svg',
    iconSize: [38, 50],
    iconAnchor: [22, 51],
    popupAnchor: [-3, -76],
});

interface RideListingMapProps {
    originLat: number;
    originLng: number;
    destinationLat: number;
    destinationLng: number;
}

const RideListingMap: React.FC<RideListingMapProps> = ({ originLat, originLng, destinationLat, destinationLng }) => {
    return (
        <MapContainer center={[originLat, originLng]} zoom={13} style={{ height: '400px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={new LatLng(originLat, originLng)} icon={markerIcon}></Marker>
            <Marker position={new LatLng(destinationLat, destinationLng)} icon={markerIcon}></Marker>
        </MapContainer>
    );
};

export default RideListingMap;
