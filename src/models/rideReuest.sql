-- Create 'ride_requests' table
CREATE TABLE ride_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    origin VARCHAR(255),
    destination VARCHAR(255),
    ride_time TIMESTAMP,
    ride_type ENUM('standard', 'premium'),
    status ENUM(
        'pending',
        'accepted',
        'completed',
        'cancelled'
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

UPDATE ride_requests SET status = 'accepted' WHERE request_id = 1;