CREATE DATABASE splitGo;

USE splitGo;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    verifyCode VARCHAR(255),
    verifyCodeExpiry DATETIME,
    verified BOOLEAN,
    verification_type VARCHAR(50),
    video_verification_status VARCHAR(50),
    account_status VARCHAR(50)
);

SELECT * FROM ride_requests WHERE user_id = 1;