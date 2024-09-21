'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useSearchParams } from 'next/navigation'; // Use Next.js 13's params and search params
import { useSession } from 'next-auth/react';

const GroupChat = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const params = useParams();  // Extract groupName from the URL params
    const searchParams = useSearchParams();  // Extract requestId from query params
    const { groupName } = params;
    const requestId = searchParams.get('requestId');  // Extract requestId from the query parameters
    const { data: session } = useSession(); // Get the current user session

    // Fetch messages whenever the groupName changes
    useEffect(() => {
        const fetchMessages = async () => {
            if (groupName) {
                try {
                    const response = await axios.get(`/api/chat-groups/${groupName}`);
                    setMessages(response.data);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            }
        };

        fetchMessages();
    }, [groupName]);

    // Handle sending a new message
    const handleSendMessage = async () => {
        if (newMessage.trim() === '' || !requestId) return;

        try {
            await axios.post(`/api/chat-groups/${groupName}`, {
                message_text: newMessage,
                sender_id: session?.user?.id,  // Include the sender's user ID
                request_id: requestId,  // Use the dynamic request_id from the URL
            });

            setNewMessage('');
            // Refresh the messages list after sending a message
            const response = await axios.get(`/api/chat-groups/${groupName}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Chat Group: {groupName}</h1>
            <div className="bg-white p-4 mb-4 rounded-lg shadow-lg max-h-96 overflow-y-scroll">
                {messages.map((message) => (
                    <div key={message.message_id} className="mb-2">
                        <p><strong>{message.sender_id}</strong>: {message.message_text}</p>
                        <p className="text-xs text-gray-500">{new Date(message.sent_at).toLocaleString()}</p>
                    </div>
                ))}
            </div>
            <div className="flex items-center">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-grow p-2 border rounded-l-md"
                />
                <button
                    onClick={handleSendMessage}
                    className="p-2 bg-blue-500 text-white rounded-r-md"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default GroupChat;
