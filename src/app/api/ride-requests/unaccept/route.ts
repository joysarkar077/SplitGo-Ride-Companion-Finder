import { NextRequest, NextResponse } from 'next/server';
import dbConnection from '@/lib/dbConnection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// POST handler
export const POST = async (req: NextRequest) => {
    const connection = await dbConnection();

    try {
        const { requestId, userId } = await req.json(); // Access JSON body in NextRequest

        // Begin a transaction
        await connection.beginTransaction();

        // Remove the user from the ride participants
        await connection.execute<ResultSetHeader>(
            `DELETE FROM ride_participants WHERE request_id = ? AND passenger_id = ?`,
            [requestId, userId]
        );

        // Notify the creator of the ride that the user has unaccepted the ride
        const [creatorRows]: [RowDataPacket[], any] = await connection.execute<RowDataPacket[]>(
            `SELECT user_id FROM ride_requests WHERE request_id = ?`,
            [requestId]
        );

        if (creatorRows.length > 0) {
            await connection.execute<ResultSetHeader>(
                `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
                [creatorRows[0].user_id, `A passenger has unaccepted your ride.`]
            );
        }

        // Commit transaction
        await connection.commit();

        return NextResponse.json({ success: true, message: 'Unaccepted the ride successfully.' });
    } catch (error) {
        console.error('Error unaccepting the ride:', error);
        await connection.rollback();
        return NextResponse.json({ success: false, error: 'Failed to unaccept the ride.' }, { status: 500 });
    }
};
