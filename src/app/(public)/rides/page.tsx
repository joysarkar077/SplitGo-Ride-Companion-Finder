'use client';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
const RideListingMap = dynamic(() => import('@/components/custionUi/RideListingMap'), { ssr: false });

const Rides = () => {
    const [rides, setRides] = useState<any[]>([]);
    const [selectedRide, setSelectedRide] = useState<any>(null); // Store the selected ride
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [sortBy, setSortBy] = useState<string[]>([]); // Array for multiple sort options
    const [rangeValue, setRangeValue] = useState<number>(1); // Default range is 1km
    const [origin, setOrigin] = useState<string>(''); // Origin input
    const [destination, setDestination] = useState<string>(''); // Destination input
    const [minFare, setMinFare] = useState<number>(0); // Min fare range
    const [maxFare, setMaxFare] = useState<number>(100); // Max fare range
    const [vehicleType, setVehicleType] = useState<string>(''); // Vehicle type
    const [totalPassengers, setTotalPassengers] = useState<number>(1); // Total passengers
    const [genderPreference, setGenderPreference] = useState<string>(''); // Gender preference
    const [ageRange, setAgeRange] = useState<string>(''); // Age range preference
    const [institution, setInstitution] = useState<string>(''); // Institution preference
    const [rideTimeFrom, setRideTimeFrom] = useState<string>(''); // Ride time "from"
    const [rideTimeTo, setRideTimeTo] = useState<string>(''); // Ride time "to"
    const { data: session } = useSession(); // Getting session data (which contains the user)

    useEffect(() => {
        const fetchRides = async () => {
            if (userLocation) {
                try {
                    const response = await axios.get(`/api/ride-requests?userLat=${userLocation.lat}&userLng=${userLocation.lng}&maxDistance=${rangeValue}&sortBy=${sortBy.join(',')}&minFare=${minFare}&maxFare=${maxFare}&vehicleType=${vehicleType}&totalPassengers=${totalPassengers}&genderPreference=${genderPreference}&ageRange=${ageRange}&institution=${institution}&origin=${origin}&destination=${destination}&rideTimeFrom=${rideTimeFrom}&rideTimeTo=${rideTimeTo}`);
                    setRides(response.data);
                } catch (error) {
                    console.error('Error fetching rides:', error);
                }
            }
        };

        // Get the user's current location only once and then fetch rides
        if (typeof window !== 'undefined') {
            if (!userLocation) {
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
            }
        }

        if (userLocation) {
            fetchRides();
        }
    }, [userLocation, rangeValue, sortBy, minFare, maxFare, vehicleType, totalPassengers, genderPreference, ageRange, institution, rideTimeFrom, rideTimeTo, origin, destination]);

    const handleRideClick = (ride: any) => {
        setSelectedRide(ride); // Set the selected ride when clicked
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const selectedSorts = [...sortBy];
        if (event.target.checked) {
            selectedSorts.push(value);
        } else {
            const index = selectedSorts.indexOf(value);
            if (index !== -1) {
                selectedSorts.splice(index, 1);
            }
        }
        setSortBy(selectedSorts);
    };

    const handleAcceptRide = async (requestId: number) => {
        const response = await axios.post('/api/accept-ride-requests', {
            requestId,
            userId: session?.user?.id,
            action: 'accept',
        });
        if (response.data.success) {
            // Refresh the ride list
            if (userLocation) {
                const updatedRides = await axios.get(`/api/ride-requests?userLat=${userLocation.lat}&userLng=${userLocation.lng}&maxDistance=${rangeValue}&sortBy=${sortBy.join(',')}`);
                setRides(updatedRides.data);
            }
            if (response.data.success) {
                alert('Ride accepted and chat group created');
                // Refresh the ride list or navigate to the chat page
            } else {
                alert('Error accepting ride: ' + response.data.message);
            }
        }
    };

    return (
        <div className="flex">
            {/* Left side: Ride List */}
            <div className="w-1/3 p-4 bg-gray-100 overflow-y-scroll">
                <h1 className="text-xl font-bold mb-4">Ride Requests</h1>

                {/* Origin Input */}
                <div className="mb-4">
                    <label className="block mb-2 font-semibold">Origin:</label>
                    <input
                        type="text"
                        placeholder="Enter origin"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}  // Use setOrigin directly
                        className="p-2 border rounded-md w-full"
                    />
                </div>

                {/* Destination Input */}
                <div className="mb-4">
                    <label className="block mb-2 font-semibold">Destination:</label>
                    <input
                        type="text"
                        placeholder="Enter destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}  // Use setDestination directly
                        className="p-2 border rounded-md w-full"
                    />
                </div>

                {/* Distance Range */}
                <div className="mb-4">
                    <label className="block mb-2 font-semibold">Distance Range (in km):</label>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={rangeValue}
                        onChange={(e) => setRangeValue(parseInt(e.target.value))}
                        className="w-full"
                    />
                    <span>{rangeValue} km</span>
                </div>

                {/* Fare Range */}
                <div className="mb-4">
                    <label className="block mb-2 font-semibold">Fare Range (in $):</label>
                    <input
                        type="number"
                        placeholder="Min Fare"
                        value={minFare}
                        onChange={(e) => setMinFare(parseFloat(e.target.value))}
                        className="p-2 border rounded-md w-full"
                    />
                    <input
                        type="number"
                        placeholder="Max Fare"
                        value={maxFare}
                        onChange={(e) => setMaxFare(parseFloat(e.target.value))}
                        className="p-2 border rounded-md w-full mt-2"
                    />
                </div>

                {/* Vehicle Type */}
                <label className="block text-gray-700">
                    Vehicle Type:
                    <select
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    >
                        <option value="">No preference</option>
                        <option value="AutoRickshaw">AutoRickshaw</option>
                        <option value="Premier">Premier</option>
                        <option value="SplitGOXL">SplitGOXL</option>
                    </select>
                </label>

                {/* Total Passengers */}
                <label className="block text-gray-700">
                    Total Passengers:
                    <input
                        type="number"
                        value={totalPassengers}
                        onChange={(e) => setTotalPassengers(parseInt(e.target.value))}
                        required
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    />
                </label>

                {/* Gender Preference */}
                <label className="block text-gray-700">
                    Gender Preference:
                    <select
                        value={genderPreference}
                        onChange={(e) => setGenderPreference(e.target.value)}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    >
                        <option value="">No preference</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </label>

                {/* Age Range Preference */}
                <label className="block text-gray-700">
                    Age Range Preference:
                    <select
                        value={ageRange}
                        onChange={(e) => setAgeRange(e.target.value)}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    >
                        <option value="">No preference</option>
                        <option value="18-25">18-25</option>
                        <option value="26-35">26-35</option>
                        <option value="36-45">36-45</option>
                        <option value="46-60">46-60</option>
                        <option value="60+">60+</option>
                    </select>
                </label>

                {/* Institution Preference */}
                <label className="block text-gray-700">
                    Institution Preference (Optional):
                    <input
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    />
                </label>

                {/* Ride Time (from and to) */}
                <label className="block text-gray-700">
                    Ride Time From:
                    <input
                        type="datetime-local"
                        value={rideTimeFrom}
                        onChange={(e) => setRideTimeFrom(e.target.value)}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    />
                </label>

                <label className="block text-gray-700">
                    Ride Time To:
                    <input
                        type="datetime-local"
                        value={rideTimeTo}
                        onChange={(e) => setRideTimeTo(e.target.value)}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    />
                </label>

                {/* Sorting options */}
                <div className="mb-4">
                    <label className="block mb-2 font-semibold">Sort By:</label>
                    <label><input type="checkbox" value="gender" onChange={handleSortChange} /> Gender</label>
                    <label><input type="checkbox" value="age" onChange={handleSortChange} /> Age Range</label>
                    <label><input type="checkbox" value="fare" onChange={handleSortChange} /> Fare Range</label>
                    <label><input type="checkbox" value="origin" onChange={handleSortChange} /> Origin</label>
                    <label><input type="checkbox" value="destination" onChange={handleSortChange} /> Destination</label>
                </div>

                {/* List of rides */}
                {rides.map((ride) => (
                    <div
                        key={ride.request_id}
                        className={`p-4 mb-2 bg-white rounded-lg shadow-md cursor-pointer ${selectedRide?.request_id === ride.request_id ? 'bg-blue-100' : ''}`}
                        onClick={() => handleRideClick(ride)}
                    >
                        <h3 className="text-lg font-semibold">Ride Request {ride.request_id}</h3>
                        <p>Origin: {ride.origin}</p>
                        <p>Destination: {ride.destination}</p>
                        <p>Fare: ${ride.total_fare}</p>
                        <p>Total Passengers: {ride.total_passengers}</p>
                        <p>Gender Preference: {ride.gender || 'None'}</p>
                        <p>Age Range: {ride.age_range || 'None'}</p>
                        <p>Institution: {ride.institution || 'None'}</p>
                        <button
                            onClick={() => handleAcceptRide(ride.request_id)}
                            disabled={ride.total_accepted >= ride.total_passengers}
                            className="bg-green-500 text-white p-2 mt-2 rounded"
                        >
                            {ride.total_accepted >= ride.total_passengers ? 'Ride Full' : 'Accept Ride'}
                        </button>
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
