'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

const GroupChat = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const params = useParams();
    const searchParams = useSearchParams();
    const { groupName } = params;
    const requestId = searchParams.get('requestId');
    const { data: session } = useSession();  // Get current user session
    const currentUserId = session?.user?.id;

    // Fetch messages initially and set up polling for real-time updates
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

        // Poll for new messages every 3 seconds
        const interval = setInterval(fetchMessages, 3000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [groupName]);

    // Handle sending a new message
    const handleSendMessage = async () => {
        if (newMessage.trim() === '' || !requestId || !currentUserId) return;

        try {
            await axios.post(`/api/chat-groups/${groupName}`, {
                message_text: newMessage,
                sender_id: currentUserId, // Use the current user’s ID from the session
                request_id: requestId,
            });

            setNewMessage('');
            // Refresh messages after sending a new one
            const response = await axios.get(`/api/chat-groups/${groupName}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-gray-50 h-screen flex flex-col">
            <h1 className="text-3xl font-bold text-purple-700 mb-4">Chat Group: {groupName}</h1>

            <div className="flex-grow overflow-y-auto bg-white p-4 rounded-lg shadow-lg max-h-96 mb-4">
                {messages.map((message) => (
                    <div
                        key={message.message_id}
                        className={`flex ${message.sender_id == currentUserId ? 'justify-end' : 'justify-start'} mb-4`}
                    >
                        <div
                            className={`${message.sender_id == currentUserId ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'
                                } p-3 rounded-lg max-w-xs shadow`}
                        >
                            <p className="font-semibold mb-1">
                                {message.sender_name || 'Anonymous'} {/* Display sender's name */}
                            </p>
                            <p>{message.message_text}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {new Date(message.sent_at).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center mt-4">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-grow p-3 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <button
                    onClick={handleSendMessage}
                    className="p-3 bg-purple-600 text-white rounded-r-md shadow-md hover:bg-purple-700 transition"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default GroupChat;
