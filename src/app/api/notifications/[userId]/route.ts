import { NextRequest, NextResponse } from 'next/server';
import dbConnection from '@/lib/dbConnection';

export const GET = async (request: NextRequest, { params }: { params: { userId: string } }) => {
    const connection = await dbConnection();
    const userId = params.userId;

    if (!userId) {
        return NextResponse.json({ success: false, message: 'Missing user ID' }, { status: 400 });
    }

    try {
        // Fetch notifications for the user
        const [notifications] = await connection.execute('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [userId]);

        return NextResponse.json(notifications, { status: 200 });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json({ success: false, message: 'Error fetching notifications' }, { status: 500 });
    }
};
