INSERT INTO
    users (
        name,
        username,
        email,
        password,
        phone,
        address,
        verifyCode,
        verifyCodeExpiry,
        verified,
        verification_type,
        video_verification_status,
        account_status
    )
VALUES (
        'John Doe',
        'john_doe',
        'john@example.com',
        'hashed_password',
        '123-456-7890',
        '123 Elm Street',
        '123456',
        NOW() + INTERVAL 1 DAY,
        TRUE,
        'email',
        'pending',
        'active'
    ),
    (
        'Jane Smith',
        'jane_smith',
        'jane@example.com',
        'hashed_password',
        '098-765-4321',
        '456 Oak Avenue',
        '654321',
        NOW() + INTERVAL 1 DAY,
        FALSE,
        'phone',
        'verified',
        'suspended'
    ),
    (
        'Alice Johnson',
        'alice_johnson',
        'alice@example.com',
        'hashed_password',
        '555-555-5555',
        '789 Pine Road',
        '111222',
        NOW() + INTERVAL 1 DAY,
        TRUE,
        'email',
        'verified',
        'active'
    ),
    (
        'Bob Brown',
        'bob_brown',
        'bob@example.com',
        'hashed_password',
        '333-333-3333',
        '101 Maple Lane',
        '333444',
        NOW() + INTERVAL 1 DAY,
        TRUE,
        'phone',
        'pending',
        'active'
    );

INSERT INTO
    ride_requests (
        user_id,
        origin,
        destination,
        total_fare,
        total_passengers,
        total_accepted,
        ride_time,
        status
    )
VALUES (
        1,
        'Downtown',
        'Airport',
        50.00,
        3,
        2,
        '2024-09-17 10:00:00',
        'pending'
    ),
    (
        2,
        'University',
        'Mall',
        30.00,
        2,
        2,
        '2024-09-17 15:00:00',
        'accepted'
    ),
    (
        3,
        'Central Park',
        'Stadium',
        40.00,
        4,
        3,
        '2024-09-18 09:00:00',
        'completed'
    );

INSERT INTO
    ride_participants (request_id, passenger_id) -- John Doe sharing his own ride
    (10, 3),
    (11, 2),
    (11, 4),
    (12, 1),
    (12, 3),
    (12, 4);
-- Bob Brown sharing ride
INSERT INTO
    notifications (user_id, message)
VALUES (
        1,
        'Your ride request to the Airport has been accepted.'
    ),
    (
        2,
        'Your ride request to the Mall has been completed.'
    ),
    (
        3,
        'Your ride request to the Stadium has been completed.'
    ),
    (
        4,
        'You have a new message regarding your ride request.'
    );

INSERT INTO
    messages (
        sender_id,
        receiver_id,
        request_id,
        message_text
    )
VALUES (
        1,
        1,
        10,
        'Hey, I will be at the pick-up point in 5 minutes.'
    ),
    (
        3,
        1,
        10,
        'Got it, I will be there on time.'
    ),
    (
        2,
        2,
        11,
        'I might be a few minutes late, please wait.'
    ),
    (
        4,
        3,
        12,
        'I am here, where are you guys?'
    );

INSERT INTO
    complaints (
        user_id,
        request_id,
        description,
        status
    )
VALUES (
        1,
        10,
        'The Passenger was late to the pick-up point.',
        'pending'
    ),
    (
        2,
        11,
        'The Passenger did not show up.',
        'resolved'
    ),
    (
        3,
        12,
        'The Passenger did not paid',
        'dismissed'
    ),
    (
        4,
        10,
        'Passenger was rude.',
        'pending'
    );