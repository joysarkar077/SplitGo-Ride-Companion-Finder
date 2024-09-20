// components/RideRequestForm.tsx
'use client';
import { useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import Map from '@/components/custionUi/Map';

const RideRequestForm = () => {
    const [origin, setOrigin] = useState<{ placeName: string; lat: number; lng: number } | null>(null);
    const [destination, setDestination] = useState<{ placeName: string; lat: number; lng: number } | null>(null);
    const [fare, setFare] = useState(0);
    const [vehicleType, setVehicleType] = useState('AutoRickshaw');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!origin || !destination) {
            alert('Please set both origin and destination.');
            return;
        }
        setLoading(true);

        try {
            const response = await axios.post('/api/ride-requests', {
                userId: 1, // Set your actual user ID here
                origin: origin.placeName,
                originLat: origin.lat,
                originLng: origin.lng,
                destination: destination.placeName,
                destinationLat: destination.lat,
                destinationLng: destination.lng,
                totalFare: fare,
                vehicleType,
                rideTime: new Date().toISOString(),
            });

            if (response.data.success) {
                alert('Ride request created successfully!');
            } else {
                console.error('Error creating ride request:', response.data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error creating ride request. Please try again later.');
        }

        setLoading(false);
    };

    const handleSelectOriginDestination = (originData: any, destinationData: any) => {
        setOrigin({
            placeName: originData.placeName,
            lat: originData.position.lat,
            lng: originData.position.lng,
        });
        setDestination({
            placeName: destinationData.placeName,
            lat: destinationData.position.lat,
            lng: destinationData.position.lng,
        });
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Map onSelectOriginDestination={handleSelectOriginDestination} />

                {origin && (
                    <div>
                        <p className="text-gray-700">Origin: {origin.placeName}</p>
                        <p className="text-gray-700">Latitude: {origin.lat}</p>
                        <p className="text-gray-700">Longitude: {origin.lng}</p>
                    </div>
                )}

                {destination && (
                    <div>
                        <p className="text-gray-700">Destination: {destination.placeName}</p>
                        <p className="text-gray-700">Latitude: {destination.lat}</p>
                        <p className="text-gray-700">Longitude: {destination.lng}</p>
                    </div>
                )}

                <label className="block text-gray-700">
                    Fare:
                    <input
                        type="number"
                        value={fare}
                        onChange={(e) => setFare(parseFloat(e.target.value))}
                        required
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    />
                </label>

                <label className="block text-gray-700">
                    Vehicle Type:
                    <select
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    >
                        <option value="AutoRickshaw">AutoRickshaw</option>
                        <option value="Premier">Premier</option>
                        <option value="SplitGOXL">SplitGOXL</option>
                    </select>
                </label>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700 transition-colors"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <Loader2 className="animate-spin h-5 w-5 mr-2" />
                            Posting Ride Request...
                        </div>
                    ) : (
                        "Post Ride Request"
                    )}
                </button>
            </form>
        </div>
    );
};

export default RideRequestForm;
