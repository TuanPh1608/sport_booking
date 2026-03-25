package com.booking.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.booking.entity.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    // BẦY 1: Kiểm tra xung đột thời gian (Time Overlap)
    // Lấy tất cả booking của sân từ một thời gian trong khoảng thời gian yêu cầu
    // Công thức: start_time < endTime AND end_time > startTime
    @Query("SELECT b FROM Booking b WHERE b.pitchId = :pitchId " +
           "AND b.status != 'CANCELLED' " +
           "AND b.startTime < :endTime " +
           "AND b.endTime > :startTime")
    List<Booking> findOverlappingBookings(
        @Param("pitchId") Long pitchId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );

    // BẦY 2: Lấy tất cả booking PENDING quá 15 phút (Ghost Booking)
    @Query("SELECT b FROM Booking b WHERE b.status = 'PENDING' " +
           "AND b.createdAt < :cutoffTime")
    List<Booking> findExpiredPendingBookings(@Param("cutoffTime") LocalDateTime cutoffTime);

    // Lấy booking của một user
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Lấy booking của một sân
    List<Booking> findByPitchIdOrderByStartTimeAsc(Long pitchId);

    // Lấy booking theo status
    List<Booking> findByStatus(Booking.BookingStatus status);
}
