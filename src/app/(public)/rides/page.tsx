'use client';
// pages/rides.tsx
import RideListingMap from '@/components/custionUi/RideListingMap';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Rides = () => {
    const [rides, setRides] = useState<any[]>([]);


    useEffect(() => {
        // Fetch the ride requests from the API
        const fetchRides = async () => {
            const response = await axios.get('/api/ride-requests');
            setRides(response.data);
            console.log(response.data);
        }

        fetchRides();
    }, []);

    return (
        <div>
            <h1>Ride Requests</h1>
            {rides.map((ride) => (
                <div key={ride.request_id}>
                    <h3>Ride Request {ride.request_id}</h3>
                    <RideListingMap
                        originLat={ride.origin_lat}
                        originLng={ride.origin_lng}
                        destinationLat={ride.destination_lat}
                        destinationLng={ride.destination_lng}
                    />
                </div>
            ))}
        </div>
    );
};

export default Rides;
