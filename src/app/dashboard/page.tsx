'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { LatLng } from 'leaflet';

// Dynamically import the Map component with SSR disabled
const Map = dynamic(() => import('@/components/custionUi/Map'), { ssr: false });

interface Location {
  position: LatLng;
  placeName: string;
}

const RideRequestForm = () => {
  const [origin, setOrigin] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [originInput, setOriginInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState<any[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<any[]>([]);
  const [fare, setFare] = useState(0);
  const [vehicleType, setVehicleType] = useState('AutoRickshaw');
  const [totalPassengers, setTotalPassengers] = useState(1);
  const [status, setStatus] = useState('pending');
  const [genderPreference, setGenderPreference] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [institution, setInstitution] = useState('');
  const [rideTime, setRideTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [droppingPinFor, setDroppingPinFor] = useState<'origin' | 'destination' | null>(null);

  const handleOriginChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setOriginInput(searchQuery);
    if (searchQuery) {
      if (typeof window !== 'undefined') {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&limit=5`);
        const data = await response.json();
        setOriginSuggestions(data);
      }
    } else {
      setOriginSuggestions([]);
    }
  };

  const handleDestinationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setDestinationInput(searchQuery);
    if (searchQuery) {
      if (typeof window !== 'undefined') {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&limit=5`);
        const data = await response.json();
        setDestinationSuggestions(data);
      }
    } else {
      setDestinationSuggestions([]);
    }
  };

  const handleSelectOrigin = (place: any) => {
    const position = new LatLng(parseFloat(place.lat), parseFloat(place.lon));
    setOriginInput(place.display_name);
    setOrigin({
      placeName: place.display_name,
      position,
    });
    setOriginSuggestions([]);
  };

  const handleSelectDestination = (place: any) => {
    const position = new LatLng(parseFloat(place.lat), parseFloat(place.lon));
    setDestinationInput(place.display_name);
    setDestination({
      placeName: place.display_name,
      position,
    });
    setDestinationSuggestions([]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!origin || !destination) {
      alert('Please set both origin and destination.');
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post('/api/ride-requests', {
        userId: 1,
        origin: origin.placeName,
        originLat: origin.position.lat,
        originLng: origin.position.lng,
        destination: destination.placeName,
        destinationLat: destination.position.lat,
        destinationLng: destination.position.lng,
        totalFare: fare,
        vehicleType,
        rideTime,
        totalPassengers,
        status,
        preferences: {
          gender: genderPreference,
          ageRange,
          institution,
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

  const handleMapClick = (latlng: LatLng, placeName: string) => {
    if (droppingPinFor === 'origin') {
      setOrigin({
        position: latlng,
        placeName,
      });
      setOriginInput(placeName);
    } else if (droppingPinFor === 'destination') {
      setDestination({
        position: latlng,
        placeName,
      });
      setDestinationInput(placeName);
    }
  };

  return (
    <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4 flex gap-10 w-full justify-stretch">
        <div>
          <label className="block text-gray-700">
            Origin:
            <input
              type="text"
              value={originInput}
              onChange={handleOriginChange}
              placeholder="Enter origin"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
            {originSuggestions.length > 0 && (
              <ul className="bg-white shadow-lg border border-gray-300 mt-2 rounded-md max-h-40 overflow-y-auto">
                {originSuggestions.map((place) => (
                  <li
                    key={place.place_id}
                    onClick={() => handleSelectOrigin(place)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {place.display_name}
                  </li>
                ))}
              </ul>
            )}
          </label>
          <button
            type="button"
            onClick={() => setDroppingPinFor('origin')}
            className={`p-2 mt-2 w-full text-white ${droppingPinFor === 'origin' ? 'bg-blue-600' : 'bg-blue-500'} rounded-md`}
          >
            Drop a Pin for Origin
          </button>

          <label className="block text-gray-700">
            Destination:
            <input
              type="text"
              value={destinationInput}
              onChange={handleDestinationChange}
              placeholder="Enter destination"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
            {destinationSuggestions.length > 0 && (
              <ul className="bg-white shadow-lg border border-gray-300 mt-2 rounded-md max-h-40 overflow-y-auto">
                {destinationSuggestions.map((place) => (
                  <li
                    key={place.place_id}
                    onClick={() => handleSelectDestination(place)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {place.display_name}
                  </li>
                ))}
              </ul>
            )}
          </label>
          <button
            type="button"
            onClick={() => setDroppingPinFor('destination')}
            className={`p-2 mt-2 w-full text-white ${droppingPinFor === 'destination' ? 'bg-blue-600' : 'bg-blue-500'} rounded-md`}
          >
            Drop a Pin for Destination
          </button>

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

          <label className="block text-gray-700">
            Status:
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            >
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>

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

          <label className="block text-gray-700">
            Institution Preference (Optional):
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
          </label>

          <label className="block text-gray-700">
            Ride Time:
            <input
              type="datetime-local"
              value={rideTime}
              onChange={(e) => setRideTime(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
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
              'Post Ride Request'
            )}
          </button>
        </div>

        <Map
          origin={origin}
          destination={destination}
          setOrigin={(location: Location) => handleMapClick(location.position, location.placeName)}
          setDestination={(location: Location) => handleMapClick(location.position, location.placeName)}
        />
      </form>
    </div>
  );
};

export default RideRequestForm;
