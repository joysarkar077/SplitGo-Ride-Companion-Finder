import { NextRequest, NextResponse } from 'next/server';
import dbConnection from '@/lib/dbConnection';

interface Params {
    userId: string;  // Define the userId type based on how it's passed (usually a string)
}

// Created Rides API
export const GET = async (request: NextRequest, { params }: { params: Params }) => {
    const connection = await dbConnection();
    const userId = params.userId;  // Extract the userId from the URL

    if (!userId) {
        return NextResponse.json({ success: false, message: 'Missing user ID' }, { status: 400 });
    }

    try {
        // Fetch rides where the current user is the creator
        const [createdRides] = await connection.execute(`
            SELECT * FROM ride_requests
            WHERE user_id = ?
            ORDER BY ride_time DESC
        `, [userId]);

        return NextResponse.json(createdRides, { status: 200 });
    } catch (error) {
        console.error('Error fetching created rides:', error);
        return NextResponse.json({ success: false, message: 'Error fetching created rides' }, { status: 500 });
    }
};
