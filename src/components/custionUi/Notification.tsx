'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

// Define the Notification type
interface Notification {
    notification_id: number;
    message: string;
    created_at: string;
}

const NotificationsPage = () => {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<Notification[]>([]); // Specify the type of notifications

    useEffect(() => {
        if (session?.user) {
            fetchNotifications();
        }
    }, [session]);

    const fetchNotifications = async () => {
        try {
            const userId = session?.user.id;
            const response = await axios.get(`/api/notifications/${userId}`);
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    return (
        <div className="p-4 max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
                <p>No notifications yet.</p>
            ) : (
                <ul className="space-y-4">
                    {notifications.map((notification) => (
                        <li key={notification.notification_id} className="p-4 bg-white shadow-md rounded-md">
                            <p>{notification.message}</p>
                            <p className="text-sm text-gray-500">{new Date(notification.created_at).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NotificationsPage;
