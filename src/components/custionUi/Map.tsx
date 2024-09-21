'use client';

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface Location {
    position: google.maps.LatLngLiteral;
    placeName: string;
}

interface MapProps {
    origin: Location | null;
    destination: Location | null;
    setOrigin: (location: Location) => void;
    setDestination: (location: Location) => void;
}

const Map: React.FC<MapProps> = ({ origin, destination, setOrigin, setDestination }) => {
    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const latlng = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
            };

            // Reverse Geocoding to get place name
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng.lat},${latlng.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`)
                .then((response) => response.json())
                .then((data) => {
                    const placeName = data.results[0]?.formatted_address || 'Unknown Place';
                    const location = { position: latlng, placeName };

                    // Set origin or destination based on user's current action
                    setOrigin ? setOrigin(location) : setDestination(location);
                });
        }
    };

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                center={origin?.position || { lat: 23.8103, lng: 90.4125 }}
                zoom={13}
                mapContainerStyle={{ height: '400px', width: '100%' }}
                onClick={handleMapClick}
            >
                {origin && <Marker position={origin.position} />}
                {destination && <Marker position={destination.position} />}
            </GoogleMap>
        </LoadScript>
    );
};

export default Map;
