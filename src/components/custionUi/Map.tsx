'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import L from 'leaflet';

const markerIcon = new L.Icon({
    iconUrl: '/map-pin.svg',
    iconSize: [38, 50],
    iconAnchor: [22, 51],
    popupAnchor: [-3, -76],
});

interface Location {
    position: LatLng;
    placeName: string;
}

interface MapProps {
    origin: Location | null;
    destination: Location | null;
    setOrigin: (location: Location) => void;
    setDestination: (location: Location) => void;
}

const ClickHandler: React.FC<{ setOrigin: any; setDestination: any; origin: Location | null; destination: Location | null }> = ({ setOrigin, setDestination, origin, destination }) => {
    useMapEvents({
        click(e) {
            const latlng = new LatLng(e.latlng.lat, e.latlng.lng);
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}&accept-language=en`)
                .then((response) => response.json())
                .then((data) => {
                    const placeName = data.display_name || 'Unknown Place';
                    const location = { position: latlng, placeName };

                    if (!origin) {
                        setOrigin(location);
                    } else if (!destination) {
                        setDestination(location);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching place name:', error);
                });
        },
    });

    return null;
};

const Map: React.FC<MapProps> = ({ origin, destination, setOrigin, setDestination }) => {
    return (
        <MapContainer center={[23.8103, 90.4125]} zoom={13} style={{ height: '400px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <ClickHandler
                setOrigin={setOrigin}
                setDestination={setDestination}
                origin={origin}
                destination={destination}
            />
            {origin && <Marker position={origin.position} icon={markerIcon}></Marker>}
            {destination && <Marker position={destination.position} icon={markerIcon}></Marker>}
        </MapContainer>
    );
};

export default Map;
