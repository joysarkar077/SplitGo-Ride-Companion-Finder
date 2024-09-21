'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Use Next.js 13 navigation
import { useSession } from 'next-auth/react';

const ChatGroupList = () => {
    const [chatGroups, setChatGroups] = useState<any[]>([]);
    const router = useRouter(); // Use Next.js 13's useRouter
    const { data: session } = useSession();

    useEffect(() => {
        const fetchChatGroups = async () => {
            if (session?.user?.id) {
                try {
                    const response = await axios.get('/api/chat-groups', {
                        params: { userId: session.user.id }
                    });
                    setChatGroups(response.data.chatGroups);
                } catch (error) {
                    console.error('Error fetching chat groups:', error);
                }
            }
        };

        fetchChatGroups();
    }, [session]);

    const handleGroupClick = (groupName: string, requestId: number) => {
        // Navigate to the chat page with groupName and requestId as query params
        router.push(`/chat/${groupName}?requestId=${requestId}`);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Your Chat Groups</h1>
            {chatGroups.length === 0 ? (
                <p>You have no active chat groups.</p>
            ) : (
                chatGroups.map((group) => (
                    <div
                        key={group.group_name}
                        className="p-4 mb-2 bg-gray-100 rounded-lg cursor-pointer"
                        onClick={() => handleGroupClick(group.group_name, group.request_id)}
                    >
                        <h3 className="text-lg font-semibold">{group.group_name}</h3>
                        <p>Expires at: {new Date(group.expiry_time).toLocaleString()}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default ChatGroupList;
