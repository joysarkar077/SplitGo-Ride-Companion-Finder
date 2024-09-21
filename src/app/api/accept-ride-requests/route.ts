import { NextRequest, NextResponse } from 'next/server';
import dbConnection from '@/lib/dbConnection';

export const POST = async (request: NextRequest) => {
    const connection = await dbConnection();
    const { requestId, userId } = await request.json();

    // Check if requestId or userId is undefined
    if (!requestId || !userId) {
        return NextResponse.json(
            { success: false, message: 'Invalid request. Missing requestId or userId.' },
            { status: 400 }
        );
    }

    try {
        // Fetch the ride request to check current status and number of accepted passengers
        const [rows] = await connection.execute<any>('SELECT * FROM ride_requests WHERE request_id = ?', [requestId]);

        // Check if rows is an array (as expected from a SELECT query)
        if (!Array.isArray(rows) || rows.length === 0) {
            return NextResponse.json(
                { success: false, message: 'Ride request not found' },
                { status: 404 }
            );
        }

        const rideRequest = rows[0];

        // Check if the ride is already full
        if (rideRequest.total_accepted >= rideRequest.total_passengers) {
            return NextResponse.json(
                { success: false, message: 'Ride is already full' },
                { status: 400 }
            );
        }

        // Add the user as a ride participant
        await connection.execute(
            'INSERT INTO ride_participants (request_id, passenger_id) VALUES (?, ?)',
            [requestId, userId]
        );

        // Increment the number of accepted passengers
        await connection.execute(
            'UPDATE ride_requests SET total_accepted = total_accepted + 1 WHERE request_id = ?',
            [requestId]
        );

        // Fetch updated ride request
        const [updatedRows] = await connection.execute<any>('SELECT * FROM ride_requests WHERE request_id = ?', [requestId]);
        const updatedRideRequest = updatedRows[0];

        // Check if the ride is now full
        if (updatedRideRequest.total_accepted >= updatedRideRequest.total_passengers) {
            // Update the status of the ride to 'accepted'
            await connection.execute(
                'UPDATE ride_requests SET status = "accepted" WHERE request_id = ?',
                [requestId]
            );
        }

        // Add the user to the chat group
        const groupName = `Ride-${requestId}-Chat`;
        await connection.execute(
            'INSERT INTO chat_group_participants (group_name, user_id) VALUES (?, ?)',
            [groupName, userId]
        );

        return NextResponse.json({ success: true, message: 'Ride accepted and added to group chat' }, { status: 200 });
    } catch (error) {
        console.error('Error accepting ride:', error);
        return NextResponse.json({ success: false, message: 'Error accepting ride' }, { status: 500 });
    }
};
