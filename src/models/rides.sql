-- Create 'rides' table
CREATE TABLE rides (
    ride_id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT,
    driver_id INT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    fare DECIMAL(10, 2),
    status ENUM(
        'ongoing',
        'completed',
        'cancelled'
    ),
    FOREIGN KEY (request_id) REFERENCES ride_requests (request_id),
    FOREIGN KEY (driver_id) REFERENCES users (user_id)
);