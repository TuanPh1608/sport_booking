-- ============================================
-- DATABASE: Hệ Thống Đặt Lịch Sân Bóng
-- ============================================

CREATE DATABASE IF NOT EXISTS pitch_booking_db;

USE pitch_booking_db;

-- ============================================
-- TABLE 1: USERS (Người dùng)
-- ============================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('CUSTOMER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER'
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================
-- TABLE 2: PITCHES (Danh sách sân bóng)
-- ============================================
CREATE TABLE pitches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    pitch_type ENUM(
        'FIVE_PLAYER',
        'SEVEN_PLAYER',
        'ELEVEN_PLAYER'
    ) NOT NULL,
    price_per_hour DECIMAL(10, 2) NOT NULL,
    status ENUM('AVAILABLE', 'MAINTENANCE') NOT NULL DEFAULT 'AVAILABLE'
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================
-- TABLE 3: BOOKINGS (Lịch đặt sân - LINH HỒN CỦA DỰ ÁN)
-- ============================================
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    pitch_id BIGINT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM(
        'PENDING',
        'CONFIRMED',
        'CANCELLED'
    ) NOT NULL DEFAULT 'PENDING',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (pitch_id) REFERENCES pitches (id) ON DELETE CASCADE,
    -- INDEX cho tăng tốc độ query xung đột thời gian
    INDEX idx_pitch_status_time (
        pitch_id,
        status,
        start_time,
        end_time
    ),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================
-- DATA: Sample dữ liệu để test
-- ============================================

-- Tạo 2 user mẫu
INSERT INTO
    users (
        full_name,
        phone_number,
        password,
        role
    )
VALUES (
        'Nguyễn Văn A',
        '0123456789',
        '$2a$10$7aQfqLsJPj7J8wKzQqHXkuN3DQJM9lKz3Z0qL5gH2bC1mN4oF7T8y',
        'CUSTOMER'
    ),
    (
        'Trần Thị B',
        '0987654321',
        '$2a$10$7aQfqLsJPj7J8wKzQqHXkuN3DQJM9lKz3Z0qL5gH2bC1mN4oF7T8y',
        'ADMIN'
    );

-- Tạo 3 sân mẫu
INSERT INTO
    pitches (
        name,
        pitch_type,
        price_per_hour,
        status
    )
VALUES (
        'Sân Số 1 - 5 Người',
        'FIVE_PLAYER',
        150000,
        'AVAILABLE'
    ),
    (
        'Sân Số 2 - 7 Người',
        'SEVEN_PLAYER',
        200000,
        'AVAILABLE'
    ),
    (
        'Sân VIP - 11 Người',
        'ELEVEN_PLAYER',
        350000,
        'AVAILABLE'
    );

-- Tạo 2 booking mẫu
-- Booking 1: 15/03/2024 từ 17:00 đến 19:00
INSERT INTO
    bookings (
        user_id,
        pitch_id,
        start_time,
        end_time,
        total_price,
        status
    )
VALUES (
        1,
        1,
        '2024-03-15 17:00:00',
        '2024-03-15 19:00:00',
        300000,
        'CONFIRMED'
    );

-- Booking 2: 15/03/2024 từ 19:30 đến 21:00 (không trùng với booking 1)
INSERT INTO
    bookings (
        user_id,
        pitch_id,
        start_time,
        end_time,
        total_price,
        status
    )
VALUES (
        2,
        1,
        '2024-03-15 19:30:00',
        '2024-03-15 21:00:00',
        225000,
        'PENDING'
    );