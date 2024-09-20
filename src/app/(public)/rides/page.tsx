'use client';
import RideListingMap from '@/components/custionUi/RideListingMap';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Rides = () => {
    const [rides, setRides] = useState<any[]>([]);
    const [selectedRide, setSelectedRide] = useState<any>(null); // Store the selected ride
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [sortBy, setSortBy] = useState<string>(''); // Sort by preference (gender, age, etc.)

    useEffect(() => {
        // Fetch the ride requests from the API
        const fetchRides = async () => {
            const response = await axios.get('/api/ride-requests');
            setRides(response.data);
            console.log(response.data);
        };

        fetchRides();

        // Get the user's current location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                console.error('Error fetching user location:', error);
            }
        );
    }, []);

    const handleRideClick = (ride: any) => {
        setSelectedRide(ride); // Set the selected ride when clicked
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(event.target.value);
    };

    // Sort the rides based on the selected preference (gender, age range, etc.)
    const sortedRides = rides.sort((a, b) => {
        if (sortBy === 'gender') {
            return a.gender.localeCompare(b.gender);
        } else if (sortBy === 'age') {
            return a.age_range.localeCompare(b.age_range);
        } else if (sortBy === 'institution') {
            return a.institution.localeCompare(b.institution);
        } else {
            return 0; // No sorting
        }
    });

    return (
        <div className="flex">
            {/* Left side: Ride List */}
            <div className="w-1/3 p-4 bg-gray-100 overflow-y-scroll">
                <h1 className="text-xl font-bold mb-4">Ride Requests</h1>

                <div className="mb-4">
                    <label className="block mb-2 font-semibold">Sort By:</label>
                    <select value={sortBy} onChange={handleSortChange} className="p-2 border rounded-md w-full">
                        <option value="">None</option>
                        <option value="gender">Gender</option>
                        <option value="age">Age Range</option>
                        <option value="institution">Institution</option>
                    </select>
                </div>

                {sortedRides.map((ride) => (
                    <div
                        key={ride.request_id}
                        className={`p-4 mb-2 bg-white rounded-lg shadow-md cursor-pointer ${selectedRide?.request_id === ride.request_id ? 'bg-blue-100' : ''}`}
                        onClick={() => handleRideClick(ride)}
                    >
                        <h3 className="text-lg font-semibold">Ride Request {ride.request_id}</h3>
                        <p>Fare: ${ride.total_fare}</p>
                        <p>Total Passengers: {ride.total_passengers}</p>
                        <p>Gender Preference: {ride.gender || 'None'}</p>
                        <p>Age Range: {ride.age_range || 'None'}</p>
                        <p>Institution: {ride.institution || 'None'}</p>
                    </div>
                ))}
            </div>

            {/* Right side: Map */}
            <div className="w-2/3 p-4">
                {selectedRide ? (
                    <RideListingMap
                        originLat={selectedRide.origin_lat}
                        originLng={selectedRide.origin_lng}
                        destinationLat={selectedRide.destination_lat}
                        destinationLng={selectedRide.destination_lng}
                    />
                ) : (
                    userLocation && (
                        <RideListingMap
                            originLat={userLocation.lat}
                            originLng={userLocation.lng}
                            destinationLat={userLocation.lat}
                            destinationLng={userLocation.lng}
                        />
                    )
                )}
            </div>
        </div>
    );
};

export default Rides;
