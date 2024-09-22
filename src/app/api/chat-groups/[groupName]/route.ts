import { NextRequest, NextResponse } from 'next/server';
import dbConnection from '@/lib/dbConnection';

export const GET = async (request: NextRequest) => {
    const connection = await dbConnection();
    const url = new URL(request.url);
    const groupName = url.pathname.split('/')[3]; // Extract group name from URL

    if (!groupName) {
        return NextResponse.json({ success: false, message: 'Missing group name' }, { status: 400 });
    }

    try {
        // Fetch all messages for the chat group, including the sender's name
        const [messages] = await connection.execute(`
            SELECT m.message_id, m.sender_id, u.name as sender_name, m.message_text, m.sent_at
            FROM messages m
            JOIN users u ON m.sender_id = u.user_id
            WHERE m.group_name = ?
            ORDER BY m.sent_at ASC
        `, [groupName]);

        return NextResponse.json(messages, { status: 200 });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ success: false, message: 'Error fetching messages' }, { status: 500 });
    }
};

export const POST = async (request: NextRequest) => {
    const connection = await dbConnection();
    const { message_text, sender_id, request_id } = await request.json();
    const url = new URL(request.url);
    const groupName = url.pathname.split('/')[3]; // Extract group name from URL

    if (!message_text || !sender_id || !groupName || !request_id) {
        return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
    }

    try {
        // Insert the new message into the messages table
        await connection.execute(`
            INSERT INTO messages (group_name, sender_id, message_text, request_id, sent_at)
            VALUES (?, ?, ?, ?, NOW())
        `, [groupName, sender_id, message_text, request_id]);

        return NextResponse.json({ success: true, message: 'Message sent' }, { status: 201 });
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ success: false, message: 'Error sending message' }, { status: 500 });
    }
};
