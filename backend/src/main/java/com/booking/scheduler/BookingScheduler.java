package com.booking.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.booking.service.BookingService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class BookingScheduler {
    private final BookingService bookingService;

    /**
     * BẪY 2: Tự động hủy ghost booking
     * Cron Job: Chạy mỗi 5 phút để kiểm tra
        * Công thức Cron: "0 every-5-minutes * * * *" (mỗi 5 phút)
     * Chi tiết:
     *   - 0: giây thứ 0
        *   - every-5-minutes: mỗi 5 phút
     *   - *: mỗi giờ
     *   - *: mỗi ngày
     *   - *: mỗi tháng
     *   - *: mỗi ngày trong tuần
     */
    @Scheduled(cron = "0 */5 * * * *")
    public void cancelExpiredPendingBookings() {
        try {
            log.info("Scheduler bat dau kiem tra ghost booking...");
            bookingService.cancelExpiredPendingBookings();
            log.info("Kiểm tra ghost booking hoàn tất");
        } catch (Exception e) {
            log.error("Lỗi khi hủy ghost booking: ", e);
        }
    }

    /**
     * Scheduler chạy mỗi 1 giờ để làm sạch các booking cũ
     */
    @Scheduled(fixedRate = 3600000) // 1 giờ = 3600000 ms
    public void cleanupOldCancelledBookings() {
        log.info("Scheduler bat dau lam sach booking cu...");
        // TODO: Implement cleanup logic nếu cần
    }
}
