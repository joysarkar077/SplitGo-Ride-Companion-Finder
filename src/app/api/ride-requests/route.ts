// pages/api/rideRequests.ts
import dbConnection from '@/lib/dbConnection'; // Assuming dbConnection is in the lib folder
interface RideRequestData {
    userId: number;
    origin: string;
    originLat: number;
    originLng: number;
    destination: string;
    destinationLat: number;
    destinationLng: number;
    totalFare: number;
    vehicleType: string;
    rideTime: string;
}
export const POST = async (request: Request) => {
    const connection = await dbConnection();
    const data = await request.json() as RideRequestData;
    const {
        userId,
        origin,
        originLat,
        originLng,
        destination,
        destinationLat,
        destinationLng,
        totalFare,
        vehicleType,
        rideTime
    } = data;

    try {
        // Convert rideTime to MySQL datetime format
        const formattedRideTime = new Date(rideTime).toISOString().slice(0, 19).replace('T', ' ');

        const [result] = await connection.execute(`
            INSERT INTO ride_requests (
                user_id, origin, origin_lat, origin_lng, destination, destination_lat, destination_lng, total_fare, vehicle_type, ride_time
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            userId,
            origin,
            originLat,
            originLng,
            destination,
            destinationLat,
            destinationLng,
            totalFare,
            vehicleType,
            formattedRideTime // Use the formatted datetime
        ]);

        return new Response(JSON.stringify({ success: true, result }), { status: 201 });
    } catch (error) {
        console.error('Error creating ride request:', error);
        return new Response(JSON.stringify({ success: false, error }));
    }
}


export const GET = async (request: Request) => {
    if (request.method !== "GET") {
        return new Response(
            JSON.stringify({ success: false, message: "Invalid request method" }),
            { status: 405 }
        );
    }

    const connection = await dbConnection();

    try {
        const [results] = await connection.execute(`SELECT * FROM ride_requests`);
        return new Response(JSON.stringify(results));
    } catch (error) {
        console.error('Error fetching ride requests:', error);
        return new Response(JSON.stringify({ success: false, error }));
    }
}
