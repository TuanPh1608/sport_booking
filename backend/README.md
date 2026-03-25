# Football Pitch Booking System

> **Hệ Thống Quản Lý Đặt Lịch Sân Bóng - Dự Án Back-end Đạt Điểm Tuyệt Đối Trong Phỏng Vấn**

![Java](https://img.shields.io/badge/Java-21-orange?logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.4-green?logo=springboot)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?logo=mysql)
![Maven](https://img.shields.io/badge/Maven-3.8-red?logo=apache-maven)

---

## Tổng Quan

Đây là một **API Backend** hoàn chỉnh để quản lý hệ thống đặt lịch sân bóng trực tuyến. Dự án này được thiết kế để giải quyết hai **"Bẫy Lớn" trong phỏng vấn Back-end**:

### BẦY 1: XUNG ĐỘT THỜI GIAN (Time Overlap)

```
Khách A đặt: 17:00 → 19:00
Khách B muốn đặt: 18:00 → 20:00
→ Query nào để chặn Khách B?
```

**Giải Pháp:** SQL query với điều kiện `start_time < endTime AND end_time > startTime`

### BẦY 2: GHOST BOOKING (Giữ Chỗ ảo)

```
Khách bấm đặt → Status = PENDING
Khách quên thanh toán cọc
→ Sân bị "cũi lại" vĩnh viễn?
```

**Giải Pháp:** Cron Job tự động hủy PENDING booking quá 15 phút

---

## Database Schema

```sql
-- 3 bảng cốt lõi
USERS          (id, fullName, phoneNumber, password, role)
PITCHES        (id, name, pitchType, pricePerHour, status)
BOOKINGS       (id, userId, pitchId, startTime, endTime, totalPrice, status, createdAt)
```

---

## Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────┐
│          Client (Postman/Web)           │
└──────────────────┬──────────────────────┘
                   │ HTTP Requests
                   ▼
┌─────────────────────────────────────────┐
│    REST Controller Layer (API Endpoints)│
│  • UserController                       │
│  • PitchController                      │
│  • BookingController ← TIME LOGIC   │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│      Service Layer (Business Logic)     │
│  • UserService                          │
│  • PitchService                         │
│  • BookingService ← BẦY 1 & 2       │
│  • BookingScheduler ← Scheduler Jobs    │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│   Data Access Layer (JPA Repositories)  │
│  • UserRepository                       │
│  • PitchRepository                      │
│  • BookingRepository ← Custom Queries   │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│      MySQL Database via Hibernate       │
│  Schema: pitch_booking_db               │
└─────────────────────────────────────────┘
```

---

## API Endpoints

### User Management

```
POST   /api/users/register      - Đăng ký tài khoản (mã hóa BCrypt)
POST   /api/users/login         - Đăng nhập
GET    /api/users/{id}          - Lấy thông tin user
```

### Pitch Management

```
POST   /api/pitches             - Tạo sân mới (Admin)
GET    /api/pitches             - Danh sách sân khả dụng
GET    /api/pitches/{id}        - Chi tiết sân
GET    /api/pitches/type/{type} - Lọc theo loại
PUT    /api/pitches/{id}/status - Cập nhật trạng thái
PUT    /api/pitches/{id}/price  - Cập nhật giá
```

### Booking Management (Core Business Logic)

```
POST   /api/bookings                    - Đặt sân (CHECK TIME OVERLAP!)
POST   /api/bookings/{id}/confirm      - Xác nhận (PENDING → CONFIRMED)
POST   /api/bookings/{id}/cancel       - Hủy booking
GET    /api/bookings/user/{userId}     - Lịch sử booking của user
GET    /api/bookings/pitch/{pitchId}   - Tất cả booking của 1 sân
```

---

## Các Tính Năng Chính

| Tính Năng              | Triển Khai                        |
| ---------------------- | --------------------------------- |
| **Xung Đột Thời Gian** | Query SQL + Validation            |
| **Ghost Booking**      | @Scheduled Cron Job (5 phút)      |
| **Password Security**  | BCrypt Hashing                    |
| **Database Indexing**  | Composite Index trên Time Columns |
| **Error Handling**     | Custom Exceptions + HTTP Status   |
| **Logging**            | SLF4J + Debug Levels              |
| **Transaction**        | JPA Auto-Management               |

---

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Một dòng lệnh - tất cả ready!
docker compose up --build

# Kiểm tra
curl http://localhost:8080/api/health

# Dừng
docker compose down
```

_Chi tiết: Xem [DOCKER_GUIDE.md](DOCKER_GUIDE.md)_

### Option 2: Local Development

#### 1. Clone & Setup

```bash
# Setup database
mysql -u root -p < src/main/resources/schema.sql

# Configure database
vim src/main/resources/application.properties
# Update: spring.datasource.password=YOUR_PASSWORD
```

#### 2. Build & Run

```bash
mvn clean install
mvn spring-boot:run
```

#### 3. Test API

```bash
# Health check
curl http://localhost:8080/api/health

# Create booking (Test BẪY 1)
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "pitchId": 1,
    "startTime": "2024-03-25T17:00:00",
    "endTime": "2024-03-25T19:00:00"
  }'
```

#### 4. Import Postman Collection

- File: `Pitch_Booking_Postman_Collection.json`
- Import → Run các test cases

---

## Tài Liệu

| File                                    | Nội Dung                              |
| --------------------------------------- | ------------------------------------- |
| `IMPLEMENTATION_GUIDE.md`               | Chi tiết về 2 bẫy phỏng vấn + trả lời |
| `DOCKER_GUIDE.md`                       | Docker setup, troubleshooting, CI/CD  |
| `SETUP_AND_RUN.md`                      | Hướng dẫn xây dựng & troubleshooting  |
| `schema.sql`                            | Database schema + sample data         |
| `Pitch_Booking_Postman_Collection.json` | API test collection                   |
| `Dockerfile`                            | Multi-stage build for Spring Boot     |
| `docker-compose.yml`                    | Orchestrate MySQL + App               |

---

## Các Câu Hỏi Phỏng Vấn Sẽ Hỏi

### Q1: "Làm sao chặn khách đặt trùng?"

> **A:** Query với công thức `start_time < endTime AND end_time > startTime AND status != 'CANCELLED'`. Nếu trả về > 0 record, reject luôn.

### Q2: "Nếu khách quên thanh toán?"

> **A:** Dùng `@Scheduled` Cron Job chạy mỗi 5 phút. Booking nào PENDING quá 15 phút sẽ auto-cancel.

### Q3: "Concurrent requests thì sao?"

> **A:** Database transaction + INDEX trên `(pitch_id, status, start_time, end_time)` sẽ handle. MySQL lock row khi insert.

### Q4: "Mở rộng thành giá khác nhau theo giờ vàng?"

> **A:** Thêm bảng `PricingRules` với điều kiện thời gian, query dynamic pricing trong service.

---

## Tech Stack

```
Backend:       Java 21 + Spring Boot 4.0.4
Database:      MySQL 8.0 + Hibernate JPA
Build:         Maven 3.8+
Security:      Spring Security + BCrypt
Scheduling:    Spring @Scheduled
Logging:       SLF4J + Logback
Dev Tools:     Lombok (Auto Getter/Setter)
```

---

## Performance Optimizations

### Database Indexing

```sql
-- Tăng tốc query xung đột thời gian
CREATE INDEX idx_pitch_status_time
ON bookings(pitch_id, status, start_time, end_time);

-- Tăng tốc query ghost booking
CREATE INDEX idx_created_at
ON bookings(created_at);
```

### Batch Operations

```java
// Hủy nhiều ghost bookings cùng lúc
bookingRepository.saveAll(expiredBookings);
```

---

## Bài Học Rút Ra

1. **Time Logic ≠ String Logic** → Luôn dùng LocalDateTime
2. **Concurrency ≠ Hope** → Index + Transaction là key
3. **Automation > Manual** → Scheduler = Hệ thống tự chữa mình
4. **Schema Matters** → Thiết kế DB tốt → Code đơn giản

---

## Support & Questions

Các bạn nên chuẩn bị những câu trả lời sau khi phỏng vấn:

1. **Explain thế nào là "xung đột thời gian"** - Vẽ timeline trên whiteboard
2. **Công thức SQL check overlap** - Viết lại từ đơn trên giấy
3. **Làm sao detect ghost booking** - Giải thích logic timestamp
4. **Index nào cần add để tối ưu** - So sánh query plan trước/sau

---

## Status

** Complete Features:**

- [x] Database Schema với 3 bảng
- [x] JPA Entity Models
- [x] Repository Queries (có custom query xung đột)
- [x] Service Layer (Business Logic)
- [x] REST Controllers (Tất cả CRUD)
- [x] Scheduled Tasks (Auto-cancel ghost booking)
- [x] Error Handling & Validation
- [x] Security Config (BCrypt)
- [x] Postman Collection
- [x] Setup Documentation

** Ready for Interview!**

---

## Cuối Cùng

Dự án này sẽ giúp bạn trả lời thuyết phục những câu phỏng vấn khó nhất về:

- Logic xử lý thời gian (Time Handling)
- Data Consistency (Xử lý concurrent access)
- System Design (Scheduling, Automation)
- Database Optimization (Indexing, Query Efficiency)

**Chúc bạn phỏng vấn thành công!**

---

Created with love for Backend Developers
**"Chốt đơn dự án này, bạn sẽ chốt đơn công việc!"**
