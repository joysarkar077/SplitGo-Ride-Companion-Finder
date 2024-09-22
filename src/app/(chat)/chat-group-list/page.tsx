'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const ChatGroupList = () => {
    const [chatGroups, setChatGroups] = useState<any[]>([]);
    const router = useRouter();
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
        router.push(`/chat/${groupName}?requestId=${requestId}`);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-purple-700 mb-6">Your Chat Groups</h1>
            {chatGroups.length === 0 ? (
                <div className="text-center bg-purple-100 text-purple-600 py-4 px-6 rounded-lg shadow-md">
                    <p className="text-lg">You have no active chat groups.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {chatGroups.map((group) => (
                        <div
                            key={group.group_name}
                            className="p-5 bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer border border-purple-300 hover:border-purple-500"
                            onClick={() => handleGroupClick(group.group_name, group.request_id)}
                        >
                            <h3 className="text-xl font-semibold text-purple-700">{group.group_name}</h3>
                            <p className="text-sm text-gray-500">Expires at: {new Date(group.expiry_time).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChatGroupList;
