// app/api/ride-requests/unaccept/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnection from '@/lib/dbConnection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    const { requestId, userId } = req.body;  // Access request body with req.body
    const connection = await dbConnection();

    try {
        // Begin a transaction
        await connection.beginTransaction();

        // Remove the user from the ride participants
        await connection.execute<ResultSetHeader>(`DELETE FROM ride_participants WHERE request_id = ? AND passenger_id = ?`, [requestId, userId]);

        // Notify the creator of the ride that the user has unaccepted the ride
        const [creator] = await connection.execute<RowDataPacket[]>(`SELECT user_id FROM ride_requests WHERE request_id = ?`, [requestId]);
        if (creator.length > 0) {
            await connection.execute<ResultSetHeader>(
                `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
                [creator[0].user_id, `A passenger has unaccepted your ride.`]
            );
        }

        // Commit transaction
        await connection.commit();

        res.status(200).json({ success: true, message: 'Unaccepted the ride successfully.' });
    } catch (error) {
        console.error('Error unaccepting the ride:', error);
        await connection.rollback();
        res.status(500).json({ success: false, error: 'Failed to unaccept the ride.' });
    }
};
