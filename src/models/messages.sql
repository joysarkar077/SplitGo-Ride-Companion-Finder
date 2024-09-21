-- Update 'messages' table to include 'group_name' and keep 'request_id'
CREATE TABLE IF NOT EXISTS messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    group_name VARCHAR(255), -- Reference to the chat group
    sender_id INT, -- The user sending the message
    message_text TEXT, -- The message content
    request_id INT, -- Ride request reference
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of the message
    FOREIGN KEY (sender_id) REFERENCES users (user_id),
    FOREIGN KEY (group_name) REFERENCES chat_groups (group_name),
    FOREIGN KEY (request_id) REFERENCES ride_requests (request_id)
);

-- Chat groups table
CREATE TABLE IF NOT EXISTS chat_groups (
    group_name VARCHAR(255) PRIMARY KEY,
    request_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_time TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES ride_requests (request_id)
);

-- Chat group participants table
CREATE TABLE IF NOT EXISTS chat_group_participants (
    group_name VARCHAR(255),
    user_id INT,
    PRIMARY KEY (group_name, user_id),
    FOREIGN KEY (group_name) REFERENCES chat_groups (group_name),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

ALTER TABLE messages
ADD COLUMN group_name VARCHAR(255),
ADD CONSTRAINT fk_group_name FOREIGN KEY (group_name) REFERENCES chat_groups (group_name);

-- Select all messages from a particular ride request, ordered by time
SELECT * FROM messages WHERE request_id = 12 ORDER BY sent_at;

-- Select all chat groups
SELECT * from chat_groups;

SELECT * FROM ride_requests WHERE request_id = 12;