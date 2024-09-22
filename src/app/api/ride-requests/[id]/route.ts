// app/api/ride-requests/[id]/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnection from '@/lib/dbConnection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    const connection = await dbConnection();

    try {
        // Begin a transaction
        await connection.beginTransaction();

        // Delete the ride request from the ride_requests table
        await connection.execute<ResultSetHeader>(`DELETE FROM ride_requests WHERE request_id = ?`, [id]);

        // Find the participants of the ride
        const [participants] = await connection.execute<RowDataPacket[]>(`SELECT passenger_id FROM ride_participants WHERE request_id = ?`, [id]);

        // Delete the participants from the ride_participants table
        await connection.execute<ResultSetHeader>(`DELETE FROM ride_participants WHERE request_id = ?`, [id]);

        // Send notifications to the participants that the ride was deleted
        for (const participant of participants) {
            await connection.execute<ResultSetHeader>(
                `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
                [participant.passenger_id, `The ride you accepted has been deleted.`]
            );
        }

        // Commit transaction
        await connection.commit();

        res.status(200).json({ success: true, message: 'Ride request deleted successfully.' });
    } catch (error) {
        console.error('Error deleting ride request:', error);
        await connection.rollback();
        res.status(500).json({ success: false, error: 'Failed to delete ride request.' });
    }
};


export const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    const { origin, destination } = req.body;
    const connection = await dbConnection();

    try {
        // Begin a transaction
        await connection.beginTransaction();

        // Update the ride request in the ride_requests table
        await connection.execute<ResultSetHeader>(
            `UPDATE ride_requests SET origin = ?, destination = ? WHERE request_id = ?`,
            [origin, destination, id]
        );

        // Find the participants of the ride
        const [participants] = await connection.execute<RowDataPacket[]>(`SELECT passenger_id FROM ride_participants WHERE request_id = ?`, [id]);

        // Send notifications to the participants that the ride was updated
        for (const participant of participants) {
            await connection.execute<ResultSetHeader>(
                `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
                [participant.passenger_id, `The ride you accepted has been updated. Please check the new details.`]
            );
        }

        // Commit transaction
        await connection.commit();

        res.status(200).json({ success: true, message: 'Ride updated successfully.' });
    } catch (error) {
        console.error('Error updating ride request:', error);
        await connection.rollback();
        res.status(500).json({ success: false, error: 'Failed to update ride request.' });
    }
};


export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    const { requestId, userId } = await req.body;
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

