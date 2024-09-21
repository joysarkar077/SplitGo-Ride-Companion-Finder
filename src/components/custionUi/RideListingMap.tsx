'use client';

import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';

interface RideListingMapProps {
    originLat: number;
    originLng: number;
    destinationLat: number;
    destinationLng: number;
}

const RideListingMap: React.FC<RideListingMapProps> = ({ originLat, originLng, destinationLat, destinationLng }) => {
    const center = { lat: originLat, lng: originLng };

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                center={center}
                zoom={13}
                mapContainerStyle={{ height: '400px', width: '100%' }}
            >
                <Marker position={{ lat: originLat, lng: originLng }} />
                <Marker position={{ lat: destinationLat, lng: destinationLng }} />
            </GoogleMap>
        </LoadScript>
    );
};

export default RideListingMap;
