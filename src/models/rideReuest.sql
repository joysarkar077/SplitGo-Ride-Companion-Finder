-- Create 'ride_requests' table

USE splitGo;

-- Ride Requests Table
-- Ride Requests Table (Updated)
CREATE TABLE ride_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT, -- The user who created the ride request
    origin VARCHAR(255),
    origin_lat DECIMAL(10, 8), -- latitude of the origin
    origin_lng DECIMAL(11, 8), -- longitude of the origin
    destination VARCHAR(255),
    destination_lat DECIMAL(10, 8), -- latitude of the destination
    destination_lng DECIMAL(11, 8), -- longitude of the destination
    total_fare DECIMAL(10, 2),
    vehicle_type ENUM(
        'AutoRickshaw',
        'Premier',
        'SplitGOXL'
    ),
    total_passengers INT,
    total_accepted INT,
    ride_time TIMESTAMP,
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

-- Ride Participants Table
CREATE TABLE ride_participants (
    request_id INT,
    passenger_id INT,
    PRIMARY KEY (request_id, passenger_id),
    FOREIGN KEY (request_id) REFERENCES ride_requests (request_id),
    FOREIGN KEY (passenger_id) REFERENCES users (user_id)
);

-- Selection for Gender and Age Preferences
CREATE TABLE ride_preferences (
    request_id INT,
    preference_id INT AUTO_INCREMENT PRIMARY KEY,
    gender ENUM('Male', 'Female', 'Other'),
    age_range VARCHAR(10), -- Format: '20-30'
    institution VARCHAR(255), -- Optional to filter institution preference
    FOREIGN KEY (request_id) REFERENCES ride_requests (request_id)
);

SELECT rr.request_id, rr.origin, rr.destination, rr.total_fare, rp.passenger_id
FROM
    ride_requests rr
    JOIN ride_participants rp ON rr.request_id = rp.request_id
WHERE
    rr.request_id = 10;

UPDATE ride_requests SET status = 'accepted' WHERE request_id = 11;

SELECT * FROM ride_requests