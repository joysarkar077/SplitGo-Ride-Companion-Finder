-- Insert data into 'users' table
INSERT INTO
    users (
        name,
        phone,
        email,
        password,
        account_status,
        user_type,
        address,
        is_verified
    )
VALUES (
        'Rahim Uddin',
        '+8801712345678',
        'rahim@example.com',
        'hashedpassword1',
        'active',
        'rider',
        'Banani, Dhaka',
        TRUE
    ),
    (
        'Karim Ahmed',
        '+8801812345678',
        'karim@example.com',
        'hashedpassword2',
        'active',
        'driver',
        'Chittagong',
        TRUE
    ),
    (
        'Fatema Begum',
        '+8801912345678',
        'fatema@example.com',
        'hashedpassword3',
        'active',
        'rider',
        'Sylhet',
        FALSE
    );

-- Insert data into 'ride_requests' table
INSERT INTO
    ride_requests (
        user_id,
        origin,
        destination,
        ride_time,
        ride_type,
        status
    )
VALUES (
        1,
        'Banani, Dhaka',
        'Gulshan, Dhaka',
        '2023-10-01 09:00:00',
        'standard',
        'pending'
    ),
    (
        3,
        'Dhanmondi, Dhaka',
        'Uttara, Dhaka',
        '2023-10-01 10:00:00',
        'premium',
        'pending'
    );

-- Insert data into 'rides' table
INSERT INTO
    rides (
        request_id,
        driver_id,
        start_time,
        end_time,
        fare,
        status
    )
VALUES (
        1,
        2,
        '2023-10-01 09:05:00',
        '2023-10-01 09:30:00',
        250.00,
        'completed'
    );

-- Insert data into 'messages' table
INSERT INTO
    messages (
        sender_id,
        receiver_id,
        ride_id,
        message_text,
        sent_at
    )
VALUES (
        1,
        2,
        1,
        "I'm waiting at the entrance.",
        '2023-10-01 09:02:00'
    ),
    (
        2,
        1,
        1,
        "On my way.",
        '2023-10-01 09:03:00'
    );

-- Insert data into 'complaints' table
INSERT INTO
    complaints (
        user_id,
        ride_id,
        description,
        status
    )
VALUES (
        1,
        1,
        "Driver was rude.",
        'pending'
    );

-- Insert data into 'notifications' table
INSERT INTO
    notifications (user_id, message, created_at)
VALUES (
        1,
        "Your ride request has been accepted.",
        '2023-10-01 09:01:00'
    ),
    (
        2,
        "You have a new ride request.",
        '2023-10-01 09:00:30'
    );