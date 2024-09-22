'use client';

// import dynamic from 'next/dynamic';
import { useState } from 'react';
import axios from 'axios';
// import { Loader2, Navigation } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
// import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';

// interface Location {
//     position: google.maps.LatLngLiteral;
//     placeName: string;
// }

// Dynamically import the Map component with SSR disabled
// const Map = dynamic(() => import('@/components/custionUi/Map'), { ssr: false });

const RideRequestForm = () => {
    const [origin, setOrigin] = useState<string>('');
    const [destination, setDestination] = useState<string>('');
    // const [originInput, setOriginInput] = useState('');
    // const [destinationInput, setDestinationInput] = useState('');
    // const [originSuggestions, setOriginSuggestions] = useState<any[]>([]);
    // const [destinationSuggestions, setDestinationSuggestions] = useState<any[]>([]);
    const [fare, setFare] = useState(0);  // Fare input state
    const [vehicleType, setVehicleType] = useState('AutoRickshaw');  // Vehicle type state
    const [totalPassengers, setTotalPassengers] = useState(1);  // Total passengers state
    const [genderPreference, setGenderPreference] = useState('');  // Gender preference state
    const [ageRange, setAgeRange] = useState('');  // Age range preference state
    const [institution, setInstitution] = useState('');  // Institution preference state
    const [rideTime, setRideTime] = useState('');  // Ride time input state
    const [loading, setLoading] = useState(false);  // Loading state
    // const [droppingPinFor, setDroppingPinFor] = useState<'origin' | 'destination' | null>(null);  // Dropping pin state
    const { data: session } = useSession();  // Getting session data

    // Function to handle location search using Google Maps Geocoding API
    // const handleLocationChange = async (e: React.ChangeEvent<HTMLInputElement>, setInput: Function, setSuggestions: Function) => {
    //     const searchQuery = e.target.value;
    //     setInput(searchQuery);

    //     if (searchQuery) {
    //         const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${searchQuery}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`);
    //         const data = await response.json();
    //         setSuggestions(data.results);
    //     } else {
    //         setSuggestions([]);
    //     }
    // };

    // const handleSelectLocation = (place: any, setLocation: Function, setInput: Function, setSuggestions: Function) => {
    //     const position = {
    //         lat: place.geometry.location.lat,
    //         lng: place.geometry.location.lng,
    //     };
    //     setInput(place.formatted_address);
    //     setLocation({
    //         placeName: place.formatted_address,
    //         position,
    //     });
    //     setSuggestions([]);
    // };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!origin || !destination) {
            alert('Please set both origin and destination.');
            return;
        }
        setLoading(true);

        try {
            const response = await axios.post('/api/ride-requests', {
                userId: session?.user.id,
                origin: origin,
                // originLat: origin.position.lat,
                // originLng: origin.position.lng,
                destination: destination,
                // destinationLat: destination.position.lat,
                // destinationLng: destination.position.lng,
                totalFare: fare,  // Sending fare to backend
                vehicleType,  // Sending vehicle type to backend
                rideTime,  // Sending ride time to backend
                totalPassengers,  // Sending total passengers to backend
                status: 'pending',
                preferences: {
                    gender: genderPreference,  // Sending gender preference to backend
                    ageRange,  // Sending age range to backend
                    institution,  // Sending institution preference to backend
                },
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

    // const handleMapClick = (latlng: google.maps.LatLngLiteral, placeName: string) => {
    //     if (droppingPinFor === 'origin') {
    //         setOrigin({ position: latlng, placeName });
    //         setOriginInput(placeName);
    //     } else if (droppingPinFor === 'destination') {
    //         setDestination({ position: latlng, placeName });
    //         setDestinationInput(placeName);
    //     }
    // };

    return (
        <div className="mt-10 p-6 bg-purple-100 shadow-md rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4 flex gap-10 w-full justify-stretch">
                <div>
                    <div className="relative flex justify-center items-center gap-2">
                        <input
                            type="text"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            placeholder="Pick up location"
                            className="mt-1 p-2 block w-full border border-purple-300 rounded-md pr-10"
                        />
                    </div>

                    <div className="relative flex justify-center items-center gap-2">
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="Enter destination"
                            className="mt-1 p-2 block w-full border border-purple-300 rounded-md pr-10"
                        />
                    </div>

                    {/* Fare Input */}
                    <div className="relative my-4">
                        <label className="absolute top-0 left-1 -translate-y-1/2 text-xs text-purple-700 bg-white px-1">
                            Fare:
                        </label>
                        <input
                            type="number"
                            value={fare}
                            onChange={(e) => setFare(parseFloat(e.target.value))}
                            required
                            className="mt-1 p-2 block w-full border border-purple-300 rounded-md"
                        />
                    </div>

                    {/* Vehicle Type Selection */}
                    <div className="relative my-4">
                        <select
                            value={vehicleType}
                            onChange={(e) => setVehicleType(e.target.value)}
                            className="mt-1 p-2 block w-full border border-purple-300 rounded-md"
                        >
                            <option value="AutoRickshaw">AutoRickshaw</option>
                            <option value="CNG">CNG</option>
                            <option value="Car">Car</option>
                            <option value="Hicks">Hicks</option>
                        </select>
                    </div>

                    {/* Total Passengers Input */}
                    <div className="relative my-4">
                        <label className="absolute top-0 left-1 -translate-y-1/2 text-xs text-purple-700 bg-white px-1">
                            Total Passengers:
                        </label>
                        <input
                            type="number"
                            value={totalPassengers}
                            onChange={(e) => setTotalPassengers(parseInt(e.target.value))}
                            required
                            className="mt-1 p-2 block w-full border border-purple-300 rounded-md"
                        />
                    </div>

                    {/* Gender Preference Selection */}
                    <div className="relative my-4">
                        <select
                            value={genderPreference}
                            onChange={(e) => setGenderPreference(e.target.value)}
                            className="mt-1 p-2 block w-full border border-purple-300 rounded-md text-sm"
                        >
                            <option value="">Gender Preference</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Age Range Selection */}
                    <div className="relative my-4  text-sm">
                        <select
                            value={ageRange}
                            onChange={(e) => setAgeRange(e.target.value)}
                            className="mt-1 p-2 block w-full border border-purple-300 rounded-md"
                        >
                            <option value="">Age Preference:</option>
                            <option value="18-25">18-25</option>
                            <option value="26-35">26-35</option>
                            <option value="36-45">36-45</option>
                            <option value="46-60">46-60</option>
                            <option value="60+">60+</option>
                        </select>
                    </div>

                    {/* Institution Preference Input */}
                    <div className="relative my-4">
                        <label className="absolute top-0 left-1 -translate-y-1/2 text-xs text-purple-700 bg-white px-1">
                            Institution Preference (Optional):
                        </label>
                        <input
                            type="text"
                            value={institution}
                            onChange={(e) => setInstitution(e.target.value)}
                            className="mt-1 p-2 block w-full border border-purple-300 rounded-md"
                        />
                    </div>

                    {/* Ride Time Input */}
                    <div className="relative my-4">
                        <input
                            type="datetime-local"
                            value={rideTime}
                            onChange={(e) => setRideTime(e.target.value)}
                            className="mt-1 p-2 block w-full border border-purple-300 rounded-md text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-purple-600 text-white px-4 py-2 rounded-md w-full hover:bg-purple-700 transition-colors"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                Posting Ride Request...
                            </div>
                        ) : (
                            'Post Ride Request'
                        )}
                    </button>
                </div>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10231.992616335718!2d90.4236479818875!3d23.775054028669604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c79a971e9fef%3A0x34b9f5766b58d238!2sMansura%20General%20Store!5e0!3m2!1sen!2sbd!4v1726963984807!5m2!1sen!2sbd" className="w-full" width="800" height="600" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </form>
        </div>
    );
};

export default RideRequestForm;