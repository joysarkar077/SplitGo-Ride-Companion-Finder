import { NextRequest, NextResponse } from 'next/server';
import dbConnection from '@/lib/dbConnection';

export const DELETE = async (request: NextRequest) => {
    const connection = await dbConnection();
    const requestId = request.url.split('/').pop();  // Extract requestId from URL

    if (!requestId) {
        return NextResponse.json({ success: false, message: 'Missing request ID' }, { status: 400 });
    }

    try {
        // Step 1: Delete ride preferences associated with the ride request
        await connection.execute('DELETE FROM ride_preferences WHERE request_id = ?', [requestId]);

        // Step 2: Delete participants in the ride request
        await connection.execute('DELETE FROM ride_participants WHERE request_id = ?', [requestId]);

        // First, get the chat group name associated with the ride request
        const [chatGroup]: any[] = await connection.execute('SELECT group_name FROM chat_groups WHERE request_id = ?', [requestId]);

        if (chatGroup.length > 0) {
            const groupName = chatGroup[0].group_name;

            // Step 3: Delete messages associated with the chat group
            await connection.execute('DELETE FROM messages WHERE group_name = ?', [groupName]);

            // Step 4: Delete participants in the chat group
            await connection.execute('DELETE FROM chat_group_participants WHERE group_name = ?', [groupName]);

            // Step 5: Delete the chat group itself
            await connection.execute('DELETE FROM chat_groups WHERE group_name = ?', [groupName]);
        }

        // Step 6: Finally, delete the ride request
        await connection.execute('DELETE FROM ride_requests WHERE request_id = ?', [requestId]);

        return NextResponse.json({ success: true, message: 'Ride and chat group deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting ride:', error);
        return NextResponse.json({ success: false, message: 'Error deleting ride' }, { status: 500 });
    }
};


export const POST = async (request: NextRequest) => {
    const connection = await dbConnection();
    const { requestId, userId } = await request.json();

    if (!requestId || !userId) {
        return NextResponse.json({ success: false, message: 'Missing parameters' }, { status: 400 });
    }

    try {
        // Remove the rejecting user from the chat group
        await connection.execute('DELETE FROM chat_group_participants WHERE group_name = (SELECT group_name FROM chat_groups WHERE request_id = ?) AND user_id = ?', [requestId, userId]);

        // Get the list of participants to notify them about the rejection
        const [participants]: any[] = await connection.execute('SELECT passenger_id FROM ride_participants WHERE request_id = ?', [requestId]);

        // Notify all participants about the rejection
        await Promise.all(participants.map(async (participant: { passenger_id: number }) => {
            await connection.execute('INSERT INTO notifications (user_id, message) VALUES (?, ?)', [participant.passenger_id, 'A participant has rejected the ride.']);
        }));

        // Remove the rejecting user from ride participants
        await connection.execute('DELETE FROM ride_participants WHERE request_id = ? AND passenger_id = ?', [requestId, userId]);

        return NextResponse.json({ success: true, message: 'Rejected the ride and removed from the chat group' }, { status: 200 });
    } catch (error) {
        console.error('Error rejecting ride:', error);
        return NextResponse.json({ success: false, message: 'Error rejecting ride' }, { status: 500 });
    }
};
