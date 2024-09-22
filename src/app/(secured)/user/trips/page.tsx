'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface RideRequest {
  request_id: number;
  user_id: number;
  origin: string;
  destination: string;
  total_fare: number;
  vehicle_type: string;
  total_passengers: number;
  total_accepted: number;
  ride_time: string;
  status: string;
}



const RidesPage = () => {
  const { data: session } = useSession();
  const [createdRides, setCreatedRides] = useState<RideRequest[]>([]);
  const [acceptedRides, setAcceptedRides] = useState<RideRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchRides();
    }
  }, [session]);

  const fetchRides = async () => {
    try {
      const userId = session?.user.id;
      const createdRidesResponse = await axios.get(`/api/ride-requests/created/${userId}`);
      const acceptedRidesResponse = await axios.get(`/api/ride-requests/accepted/${userId}`);

      setCreatedRides(createdRidesResponse.data);
      setAcceptedRides(acceptedRidesResponse.data);
    } catch (error) {
      console.error('Error fetching rides:', error);
    }
  };

  const handleDeleteRide = async (requestId: number) => {
    if (confirm('Are you sure you want to delete this ride?')) {
      try {
        setLoading(true);
        await axios.delete(`/api/ride-requests/${requestId}`);

        // Send notifications to users who accepted the ride
        await axios.post(`/api/notifications/ride-deleted`, {
          requestId,
        });

        alert('Ride deleted successfully.');
        fetchRides();
      } catch (error) {
        console.error('Error deleting ride:', error);
        alert('Failed to delete the ride.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditRide = async (ride: RideRequest) => {
    const newOrigin = prompt('Enter new origin:', ride.origin);
    const newDestination = prompt('Enter new destination:', ride.destination);

    if (newOrigin && newDestination) {
      try {
        setLoading(true);
        await axios.put(`/api/ride-requests/${ride.request_id}`, {
          origin: newOrigin,
          destination: newDestination,
        });

        // Send notifications to users who accepted the ride
        await axios.post(`/api/notifications/ride-edited`, {
          requestId: ride.request_id,
        });

        alert('Ride updated successfully.');
        fetchRides();
      } catch (error) {
        console.error('Error editing ride:', error);
        alert('Failed to update the ride.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUnacceptRide = async (requestId: number) => {
    if (confirm('Are you sure you want to unaccept this ride?')) {
      try {
        setLoading(true);
        await axios.post(`/api/ride-requests/unaccept`, {
          requestId,
          userId: session?.user.id,
        });

        // Send notifications to the creator of the ride
        await axios.post(`/api/notifications/ride-unaccepted`, {
          requestId,
          userId: session?.user.id,
        });

        alert('You have unaccepted the ride.');
        fetchRides();
      } catch (error) {
        console.error('Error unaccepting ride:', error);
        alert('Failed to unaccept the ride.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">My Rides</h1>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Rides I Created</h2>
        {createdRides.length === 0 ? (
          <p>No rides created yet.</p>
        ) : (
          <ul className="space-y-4">
            {createdRides.map((ride) => (
              <li key={ride.request_id} className="p-4 bg-white shadow-md rounded-md">
                <p><strong>Origin:</strong> {ride.origin}</p>
                <p><strong>Destination:</strong> {ride.destination}</p>
                <p><strong>Fare:</strong> {ride.total_fare}</p>
                <p><strong>Ride Time:</strong> {new Date(ride.ride_time).toLocaleString()}</p>
                <p><strong>Status:</strong> {ride.status}</p>
                <div className="flex space-x-4 mt-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={() => handleEditRide(ride)}
                  >
                    Edit Ride
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    onClick={() => handleDeleteRide(ride.request_id)}
                    disabled={loading}
                  >
                    Delete Ride
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Rides I Accepted</h2>
        {acceptedRides.length === 0 ? (
          <p>No rides accepted yet.</p>
        ) : (
          <ul className="space-y-4">
            {acceptedRides.map((ride) => (
              <li key={ride.request_id} className="p-4 bg-white shadow-md rounded-md">
                <p><strong>Origin:</strong> {ride.origin}</p>
                <p><strong>Destination:</strong> {ride.destination}</p>
                <p><strong>Fare:</strong> {ride.total_fare}</p>
                <p><strong>Ride Time:</strong> {new Date(ride.ride_time).toLocaleString()}</p>
                <p><strong>Status:</strong> {ride.status}</p>
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 mt-2"
                  onClick={() => handleUnacceptRide(ride.request_id)}
                  disabled={loading}
                >
                  Unaccept Ride
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RidesPage;
