-- Create 'notifications' table
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

SELECT *
FROM notifications
WHERE
    user_id = 1
ORDER BY created_at DESC;

DELETE FROM notifications WHERE notification_id = 1;