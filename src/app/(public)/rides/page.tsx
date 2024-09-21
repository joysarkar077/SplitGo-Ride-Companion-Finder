'use client';
// import dynamic from 'next/dynamic';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

// Dynamically import RideListingMap component with SSR disabled
// const RideListingMap = dynamic(() => import('@/components/custionUi/RideListingMap'), { ssr: false });

const Rides = () => {
    const [rides, setRides] = useState<any[]>([]);
    const [selectedRide, setSelectedRide] = useState<any>(null); // Store the selected ride
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [sortBy, setSortBy] = useState<string[]>([]); // Array for multiple sort options
    // const [rangeValue, setRangeValue] = useState<number>(1); // Default range is 1km
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
                    const response = await axios.get(`/api/ride-requests?sortBy=${sortBy.join(',')}&minFare=${minFare}&maxFare=${maxFare}&vehicleType=${vehicleType}&totalPassengers=${totalPassengers}&genderPreference=${genderPreference}&ageRange=${ageRange}&institution=${institution}&origin=${origin}&destination=${destination}&rideTimeFrom=${rideTimeFrom}&rideTimeTo=${rideTimeTo}`);
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
    }, [sortBy, minFare, maxFare, vehicleType, totalPassengers, genderPreference, ageRange, institution, rideTimeFrom, rideTimeTo, origin, destination]);

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
                const updatedRides = await axios.get(`/api/ride-requests?sortBy=${sortBy.join(',')}`);
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
        <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
            {/* Left side: Ride List */}
            <div className="space-y-4 flex gap-10 w-full justify-stretch">
                <div>
                    <h1 className="text-xl font-bold mb-4">Ride Requests</h1>

                    {/* Origin Input */}
                    {/* Origin Input */}
                    <div className="relative my-2">
                        <label className="absolute top-0 left-1 -translate-y-1/2 text-xs text-gray-700 bg-white px-1">
                            Origin:
                        </label>
                        <input
                            type="text"
                            placeholder="Enter origin"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Destination Input */}
                    <div className="relative my-2">
                        <label className="absolute top-0 left-1 -translate-y-1/2 text-xs text-gray-700 bg-white px-1">
                            Destination:
                        </label>
                        <input
                            type="text"
                            placeholder="Enter destination"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="flex gap-2">                    {/* Fare Range */}
                        <div className="relative my-2">
                            <label className="absolute top-0 left-1 -translate-y-1/2 text-xs text-gray-700 bg-white px-1">
                                Min Fare:
                            </label>
                            <input
                                type="number"
                                placeholder="Min Fare"
                                value={minFare}
                                onChange={(e) => setMinFare(parseFloat(e.target.value))}
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="relative my-2">

                            <label className="absolute top-0 left-1 -translate-y-1/2 text-xs text-gray-700 bg-white px-1 mt-2">
                                Max Fare:
                            </label>
                            <input
                                type="number"
                                placeholder="Max Fare"
                                value={maxFare}
                                onChange={(e) => setMaxFare(parseFloat(e.target.value))}
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>

                    {/* Vehicle Type */}
                    <div className="relative my-2">
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
                    </div>

                    {/* Total Passengers */}
                    <div className="relative my-2">
                        <label className="absolute top-0 left-1 -translate-y-1/2 text-xs text-gray-700 bg-white px-1">
                            Total Passengers:
                        </label>
                        <input
                            type="number"
                            value={totalPassengers}
                            onChange={(e) => setTotalPassengers(parseInt(e.target.value))}
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Gender Preference */}
                    <div className="relative my-2">
                        <select
                            value={genderPreference}
                            onChange={(e) => setGenderPreference(e.target.value)}
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md text-sm"
                        >
                            <option value="">Gender Preference</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Age Range Preference */}
                    <div className="relative my-2">
                        <select
                            value={ageRange}
                            onChange={(e) => setAgeRange(e.target.value)}
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        >
                            <option value="">Age Preference:</option>
                            <option value="18-25">18-25</option>
                            <option value="26-35">26-35</option>
                            <option value="36-45">36-45</option>
                            <option value="46-60">46-60</option>
                            <option value="60+">60+</option>
                        </select>
                    </div>

                    {/* Institution Preference */}
                    <div className="relative my-2">
                        <label className="absolute top-0 left-1 -translate-y-1/2 text-xs text-gray-700 bg-white px-1">
                            Institution Preference (Optional):
                        </label>
                        <input
                            type="text"
                            value={institution}
                            onChange={(e) => setInstitution(e.target.value)}
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="flex gap-2">
                        {/* Ride Time */}
                        <div className="relative my-2">
                            <input
                                type="datetime-local"
                                value={rideTimeFrom}
                                onChange={(e) => setRideTimeFrom(e.target.value)}
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md text-sm"
                            />
                        </div>

                        <div className="relative my-2">
                            <input
                                type="datetime-local"
                                value={rideTimeTo}
                                onChange={(e) => setRideTimeTo(e.target.value)}
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md text-sm"
                            />
                        </div>

                    </div>


                    {/* List of rides */}

                </div>
                <div>
                    {rides.map((ride) => (
                        <>        {/* Sorting options */}
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold">Sort By:</label>
                                <label><input type="checkbox" value="gender" onChange={handleSortChange} /> Gender</label>
                                <label><input type="checkbox" value="age" onChange={handleSortChange} /> Age Range</label>
                                <label><input type="checkbox" value="fare" onChange={handleSortChange} /> Fare Range</label>
                                <label><input type="checkbox" value="origin" onChange={handleSortChange} /> Origin</label>
                                <label><input type="checkbox" value="destination" onChange={handleSortChange} /> Destination</label>
                            </div>
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
                        </>
                    ))}
                </div>
            </div>
            {/* Right side: Map */}
            {/* <div className="w-2/3 p-4">
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
            </div> */}


        </div>
    );
};

export default Rides;
