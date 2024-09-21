import dbConnection from "@/lib/dbConnection";
import { ResultSetHeader } from "mysql2"; // Import the correct type

interface RideRequestData {
    userId: number;
    origin: string;
    // originLat: number;
    // originLng: number;
    destination: string;
    // destinationLat: number;
    // destinationLng: number;
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
    const data = (await request.json()) as RideRequestData;
    const {
        userId,
        origin,
        destination,
        totalFare,
        vehicleType,
        rideTime,
        totalPassengers,
        status,
        preferences,
    } = data;

    console.log(userId);
    try {
        // Start transaction
        await connection.beginTransaction();

        // Insert into ride_requests table
        const formattedRideTime = new Date(rideTime)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
        const [rideRequestResult] = await connection.execute<ResultSetHeader>(
            `
            INSERT INTO ride_requests (
                user_id, origin, destination, total_fare,
                vehicle_type, ride_time, total_passengers, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
            [
                userId,
                origin,
                destination,
                totalFare,
                vehicleType,
                formattedRideTime,
                totalPassengers,
                status,
            ]
        );

        const requestId = rideRequestResult.insertId;

        // Create a chat group for the ride request
        const groupName = `Ride-${requestId}-Chat`;
        await connection.execute(
            `
            INSERT INTO chat_groups (group_name, request_id, created_at, expiry_time)
            VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY))
        `,
            [groupName, requestId]
        );

        // Add the creator of the ride (userId) to the chat group
        await connection.execute(
            "INSERT INTO chat_group_participants (group_name, user_id) VALUES (?, ?)",
            [groupName, userId]
        );

        // Insert preferences (if any)
        if (preferences) {
            const { gender, ageRange, institution } = preferences;
            await connection.execute(
                `
                INSERT INTO ride_preferences (request_id, gender, age_range, institution)
                VALUES (?, ?, ?, ?)
            `,
                [requestId, gender || null, ageRange || null, institution || null]
            );
        }

        // Commit transaction
        await connection.commit();

        return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (error) {
        console.error("Error creating ride request:", error);
        await connection.rollback(); // Rollback transaction in case of error
        return new Response(JSON.stringify({ success: false, error }), {
            status: 500,
        });
    }
};

export const GET = async (request: Request) => {
    const connection = await dbConnection();

    // Parse query parameters for sorting and filtering
    const url = new URL(request.url);
    const sortBy = url.searchParams.get("sortBy") || ""; // Default to empty string if null
    // const userLat = parseFloat(url.searchParams.get('userLat') || '0'); // Default to 0 if null
    // const userLng = parseFloat(url.searchParams.get('userLng') || '0'); // Default to 0 if null
    // const maxDistance = parseFloat(url.searchParams.get('maxDistance') || '1'); // Default to 1 if null
    const minFare = parseFloat(url.searchParams.get("minFare") || "0"); // Default to 0 if null
    const maxFare = parseFloat(url.searchParams.get("maxFare") || "100"); // Default to 100 if null
    const vehicleType = url.searchParams.get("vehicleType") || ""; // Get vehicle type
    const totalPassengers = parseInt(
        url.searchParams.get("totalPassengers") || "1"
    ); // Get total passengers
    const genderPreference = url.searchParams.get("genderPreference") || ""; // Get gender preference
    const ageRange = url.searchParams.get("ageRange") || ""; // Get age range
    const institution = url.searchParams.get("institution") || ""; // Get institution preference
    const origin = url.searchParams.get("origin") || ""; // Get origin
    const destination = url.searchParams.get("destination") || ""; // Get destination
    const rideTimeFrom = url.searchParams.get("rideTimeFrom") || ""; // Get "from" ride time
    const rideTimeTo = url.searchParams.get("rideTimeTo") || ""; // Get "to" ride time

    try {
        // Build the SQL query dynamically based on filters
        const query = `
           SELECT rr.*, rp.gender, rp.age_range, rp.institution
FROM ride_requests rr
LEFT JOIN ride_preferences rp ON rr.request_id = rp.request_id
WHERE rr.total_fare BETWEEN ? AND ?
AND rr.vehicle_type LIKE ?
AND rr.total_passengers >= ?
${genderPreference ? "AND rp.gender = ?" : ""}
${ageRange ? "AND rp.age_range = ?" : ""}
${institution ? "AND rp.institution LIKE ?" : ""}
${origin ? "AND rr.origin LIKE ?" : ""}
${destination ? "AND rr.destination LIKE ?" : ""}
${rideTimeFrom && rideTimeTo ? "AND rr.ride_time BETWEEN ? AND ?" : ""}
ORDER BY
CASE 
    WHEN ? = 'gender' THEN rp.gender 
    WHEN ? = 'age' THEN rp.age_range
    WHEN ? = 'fare' THEN rr.total_fare 
    WHEN ? = 'origin' THEN rr.origin
    WHEN ? = 'destination' THEN rr.destination
END

        `;

        // Build the query parameters dynamically based on filters
        const params = [minFare, maxFare, `%${vehicleType}%`, totalPassengers];
        if (genderPreference) params.push(genderPreference);
        if (ageRange) params.push(ageRange);
        if (institution) params.push(`%${institution}%`);
        if (origin) params.push(`%${origin}%`);
        if (destination) params.push(`%${destination}%`);
        if (rideTimeFrom && rideTimeTo) {
            params.push(rideTimeFrom, rideTimeTo); // Add ride time range filtering
        }
        params.push(sortBy, sortBy, sortBy, sortBy, sortBy);

        // Execute the query with the built parameters
        const [results] = await connection.execute(query, params);

        return new Response(JSON.stringify(results), { status: 200 });
    } catch (error) {
        console.error("Error fetching ride requests:", error);
        return new Response(JSON.stringify({ success: false, error }), {
            status: 500,
        });
    }
};
