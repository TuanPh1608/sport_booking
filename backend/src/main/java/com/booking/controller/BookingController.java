package com.booking.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.booking.entity.Booking;
import com.booking.service.BookingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;
    private final DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    /**
     * POST /api/bookings - Tạo booking mới
     * 
     * BẪY 1: Xử lý xung đột thời gian
     * Hệ thống sẽ kiểm tra xem khoảng thời gian có trùng với booking nào không
     * Công thức kiểm tra: startTime < endTime AND endTime > startTime
     */
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody CreateBookingRequest request) {
        try {
            LocalDateTime startTime = LocalDateTime.parse(request.getStartTime(), formatter);
            LocalDateTime endTime = LocalDateTime.parse(request.getEndTime(), formatter);

            Booking booking = bookingService.createBooking(
                request.getUserId(),
                request.getPitchId(),
                startTime,
                endTime
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                    "message", "Đặt sân thành công! Vui lòng thanh toán cọc để xác nhận",
                    "bookingId", booking.getId(),
                    "status", booking.getStatus().name(),
                    "totalPrice", booking.getTotalPrice(),
                    "startTime", booking.getStartTime().format(formatter),
                    "endTime", booking.getEndTime().format(formatter)
                ));
        } catch (BookingService.BookingException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Định dạng thời gian không hợp lệ. Dùng ISO 8601, ví dụ 2026-03-25T17:00:00"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Lỗi: " + e.getMessage()));
        }
    }

    /**
     * POST /api/bookings/{id}/confirm - Xác nhận booking (thanh toán cọc)
     * Chuyển status từ PENDING -> CONFIRMED
     */
    @PostMapping("/{id}/confirm")
    public ResponseEntity<?> confirmBooking(@PathVariable Long id) {
        try {
            Booking booking = bookingService.confirmBooking(id);

            return ResponseEntity.ok(Map.of(
                "message", "Đặt sân đã được xác nhận!",
                "bookingId", booking.getId(),
                "status", booking.getStatus().name(),
                "totalPrice", booking.getTotalPrice()
            ));
        } catch (BookingService.BookingException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/bookings/{id}/cancel - Hủy booking
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            Booking booking = bookingService.cancelBooking(id);

            return ResponseEntity.ok(Map.of(
                "message", "Booking đã được hủy",
                "bookingId", booking.getId(),
                "status", booking.getStatus().name()
            ));
        } catch (BookingService.BookingException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /api/bookings/user/{userId} - Lấy lịch sử booking của user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserBookings(@PathVariable Long userId) {
        List<Booking> bookings = bookingService.getUserBookings(userId);

        return ResponseEntity.ok(Map.of(
            "userId", userId,
            "total", bookings.size(),
            "bookings", bookings.stream()
                .map(this::formatBooking)
                .collect(Collectors.toList())
        ));
    }

    /**
     * GET /api/bookings/pitch/{pitchId} - Lấy tất cả booking của một sân
     */
    @GetMapping("/pitch/{pitchId}")
    public ResponseEntity<?> getPitchBookings(@PathVariable Long pitchId) {
        List<Booking> bookings = bookingService.getPitchBookings(pitchId);

        return ResponseEntity.ok(Map.of(
            "pitchId", pitchId,
            "total", bookings.size(),
            "bookings", bookings.stream()
                .map(this::formatBooking)
                .collect(Collectors.toList())
        ));
    }

    /**
     * GET /api/bookings/{id} - Lấy chi tiết booking
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getBooking(@PathVariable Long id) {
        try {
            Booking booking = bookingService.getBookingById(id);
            return ResponseEntity.ok(formatBooking(booking));
        } catch (BookingService.BookingException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }

    // Helper method
    private Map<String, Object> formatBooking(Booking booking) {
        return Map.of(
            "id", booking.getId(),
            "userId", booking.getUserId(),
            "pitchId", booking.getPitchId(),
            "startTime", booking.getStartTime().format(formatter),
            "endTime", booking.getEndTime().format(formatter),
            "totalPrice", booking.getTotalPrice(),
            "status", booking.getStatus().name(),
            "createdAt", booking.getCreatedAt().format(formatter)
        );
    }

    // DTO
    public static class CreateBookingRequest {
        private Long userId;
        private Long pitchId;
        private String startTime;  // ISO 8601 format: 2024-01-15T17:00:00
        private String endTime;    // ISO 8601 format: 2024-01-15T19:00:00

        // Getters
        public Long getUserId() { return userId; }
        public Long getPitchId() { return pitchId; }
        public String getStartTime() { return startTime; }
        public String getEndTime() { return endTime; }
    }
}
