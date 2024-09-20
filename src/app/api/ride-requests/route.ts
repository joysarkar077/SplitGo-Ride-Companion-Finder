import dbConnection from '@/lib/dbConnection';
import { ResultSetHeader } from 'mysql2'; // Import the correct type

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
    totalPassengers: number;
    status: string;
    preferences: {
        gender: string;
        ageRange: string;
        institution: string;
    };
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
        rideTime,
        totalPassengers,
        status,
        preferences
    } = data;

    try {
        // Start transaction
        await connection.beginTransaction();

        // Insert into ride_requests table
        const formattedRideTime = new Date(rideTime).toISOString().slice(0, 19).replace('T', ' ');
        const [rideRequestResult] = await connection.execute<ResultSetHeader>(`
            INSERT INTO ride_requests (
                user_id, origin, origin_lat, origin_lng, destination, destination_lat, destination_lng, total_fare, vehicle_type, ride_time, total_passengers, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            formattedRideTime,
            totalPassengers,
            status
        ]);

        const requestId = rideRequestResult.insertId; // This will work now

        // Insert into ride_preferences table
        if (preferences) {
            const { gender, ageRange, institution } = preferences;
            await connection.execute(`
                INSERT INTO ride_preferences (
                    request_id, gender, age_range, institution
                ) VALUES (?, ?, ?, ?)
            `, [
                requestId,
                gender || null,
                ageRange || null,
                institution || null
            ]);
        }

        // Commit transaction
        await connection.commit();

        return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (error) {
        console.error('Error creating ride request:', error);
        await connection.rollback(); // Rollback transaction in case of error
        return new Response(JSON.stringify({ success: false, error }), { status: 500 });
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
        const [results] = await connection.execute(`
            SELECT rr.*, rp.gender, rp.age_range, rp.institution
            FROM ride_requests rr
            LEFT JOIN ride_preferences rp ON rr.request_id = rp.request_id
        `);
        return new Response(JSON.stringify(results));
    } catch (error) {
        console.error('Error fetching ride requests:', error);
        return new Response(JSON.stringify({ success: false, error }));
    }
}
