package com.booking.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.booking.entity.Booking;
import com.booking.entity.Pitch;
import com.booking.entity.User;
import com.booking.repository.BookingRepository;
import com.booking.repository.PitchRepository;
import com.booking.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {
    private final BookingRepository bookingRepository;
    private final PitchRepository pitchRepository;
    private final UserRepository userRepository;

    /**
     * BẪY 1: Kiểm tra xung đột thời gian và tạo booking
     * Công thức SQL: startTime < endTime AND endTime > startTime
     * Chỉ cho phép nếu không có booking nào CONFIRMED/PENDING trùng lịch
     */
    @Transactional
    public Booking createBooking(Long userId, Long pitchId,
                                  LocalDateTime startTime, LocalDateTime endTime) 
            throws BookingException {

        validateCreateBookingRequest(userId, pitchId, startTime, endTime);

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new BookingException("Người dùng không tồn tại"));

        if (user.getRole() != User.UserRole.CUSTOMER && user.getRole() != User.UserRole.ADMIN) {
            throw new BookingException("Vai trò người dùng không hợp lệ");
        }

        // Validate thời gian
        if (startTime.isAfter(endTime) || startTime.equals(endTime)) {
            throw new BookingException("Thời gian kết thúc phải sau thời gian bắt đầu");
        }

        if (startTime.isBefore(LocalDateTime.now())) {
            throw new BookingException("Không thể đặt sân cho thời gian quá khứ");
        }

        if (ChronoUnit.MINUTES.between(startTime, endTime) < 30) {
            throw new BookingException("Thời lượng đặt sân tối thiểu là 30 phút");
        }

        // Khóa theo pitch để tránh race-condition khi 2 request đặt cùng lúc
        Pitch pitch = pitchRepository.findByIdForUpdate(pitchId)
            .orElseThrow(() -> new BookingException("Sân không tồn tại"));

        // Kiểm tra sân có khả dụng không
        if (pitch.getStatus() == Pitch.PitchStatus.MAINTENANCE) {
            throw new BookingException("Sân đang bảo trì, không thể đặt");
        }

        // KIỂM TRA XUNG ĐỘT THỜI GIAN
        // Query database để lấy tất cả booking có thời gian trùng
        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(
            pitchId, startTime, endTime
        );

        if (!overlappingBookings.isEmpty()) {
            throw new BookingException(
                String.format("Sân đã được đặt từ %s đến %s. Vui lòng chọn giờ khác",
                    overlappingBookings.get(0).getStartTime(),
                    overlappingBookings.get(0).getEndTime())
            );
        }

        // Tính tổng giá theo phút để tránh sai số với booking lẻ giờ
        long minutes = ChronoUnit.MINUTES.between(startTime, endTime);
        BigDecimal totalHours = BigDecimal.valueOf(minutes)
            .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
        BigDecimal totalPrice = pitch.getPricePerHour().multiply(totalHours)
            .setScale(0, RoundingMode.HALF_UP);

        // Tạo booking mới với status PENDING (chờ thanh toán)
        Booking booking = Booking.builder()
            .userId(userId)
            .pitchId(pitchId)
            .startTime(startTime)
            .endTime(endTime)
            .totalPrice(totalPrice)
            .status(Booking.BookingStatus.PENDING)
            .build();

        return bookingRepository.save(booking);
    }

    /**
     * Xác nhận booking (PENDING -> CONFIRMED)
     * Gọi khi khách thanh toán tiền cọc thành công
     */
    public Booking confirmBooking(Long bookingId) throws BookingException {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new BookingException("Booking không tồn tại"));

        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new BookingException("Chỉ có thể xác nhận booking ở trạng thái PENDING");
        }

        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        return bookingRepository.save(booking);
    }

    /**
     * Hủy booking
     */
    public Booking cancelBooking(Long bookingId) throws BookingException {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new BookingException("Booking không tồn tại"));

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new BookingException("Booking đã hủy rồi");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }

    /**
     * BẪY 2: Tự động hủy ghost booking (PENDING quá 15 phút)
     * Được gọi bởi scheduler mỗi 5 phút
     */
    public void cancelExpiredPendingBookings() {
        // Lấy thời gian 15 phút trước
        LocalDateTime cutoffTime = LocalDateTime.now().minus(15, ChronoUnit.MINUTES);

        // Lấy tất cả booking PENDING được tạo trước cutoff
        List<Booking> expiredBookings = bookingRepository.findExpiredPendingBookings(cutoffTime);

        if (!expiredBookings.isEmpty()) {
            expiredBookings.forEach(booking -> {
                booking.setStatus(Booking.BookingStatus.CANCELLED);
            });
            bookingRepository.saveAll(expiredBookings);
            log.info("Da tu dong huy {} ghost booking", expiredBookings.size());
        }
    }

    /**
     * Lấy lịch sử booking của user
     */
    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Lấy tất cả booking của một sân
     */
    public List<Booking> getPitchBookings(Long pitchId) {
        return bookingRepository.findByPitchIdOrderByStartTimeAsc(pitchId);
    }

    public Booking getBookingById(Long bookingId) throws BookingException {
        if (bookingId == null || bookingId <= 0) {
            throw new BookingException("bookingId không hợp lệ");
        }

        return bookingRepository.findById(bookingId)
            .orElseThrow(() -> new BookingException("Booking không tồn tại"));
    }

    private void validateCreateBookingRequest(Long userId, Long pitchId,
            LocalDateTime startTime, LocalDateTime endTime) throws BookingException {
        if (userId == null || userId <= 0) {
            throw new BookingException("userId không hợp lệ");
        }

        if (pitchId == null || pitchId <= 0) {
            throw new BookingException("pitchId không hợp lệ");
        }

        if (startTime == null || endTime == null) {
            throw new BookingException("Thời gian bắt đầu/kết thúc không được để trống");
        }
    }

    /**
     * Custom exception cho booking
     */
    public static class BookingException extends Exception {
        public BookingException(String message) {
            super(message);
        }
    }
}
