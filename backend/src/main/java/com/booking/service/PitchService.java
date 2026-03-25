package com.booking.service;

import com.booking.entity.Pitch;
import com.booking.repository.PitchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PitchService {
    private final PitchRepository pitchRepository;

    /**
     * Tạo sân mới
     */
    public Pitch createPitch(String name, Pitch.PitchType pitchType, BigDecimal pricePerHour)
            throws PitchException {
        validatePitchInput(name, pitchType, pricePerHour);

        Pitch pitch = Pitch.builder()
            .name(name)
            .pitchType(pitchType)
            .pricePerHour(pricePerHour)
            .status(Pitch.PitchStatus.AVAILABLE)
            .build();

        return pitchRepository.save(pitch);
    }

    /**
     * Lấy tất cả sân khả dụng
     */
    public List<Pitch> getAvailablePitches() {
        return pitchRepository.findByStatus(Pitch.PitchStatus.AVAILABLE);
    }

    /**
     * Lấy sân theo loại
     */
    public List<Pitch> getPitchesByType(Pitch.PitchType pitchType) {
        return pitchRepository.findByPitchType(pitchType);
    }

    /**
     * Lấy sân theo ID
     */
    public Pitch getPitchById(Long id) throws PitchException {
        return pitchRepository.findById(id)
            .orElseThrow(() -> new PitchException("Sân không tồn tại"));
    }

    /**
     * Cập nhật trạng thái sân
     */
    public Pitch updatePitchStatus(Long pitchId, Pitch.PitchStatus status) throws PitchException {
        Pitch pitch = getPitchById(pitchId);
        pitch.setStatus(status);
        return pitchRepository.save(pitch);
    }

    /**
     * Cập nhật giá sân
     */
    public Pitch updatePitchPrice(Long pitchId, BigDecimal pricePerHour) throws PitchException {
        if (pricePerHour == null || pricePerHour.compareTo(BigDecimal.ZERO) <= 0) {
            throw new PitchException("Giá sân phải lớn hơn 0");
        }

        Pitch pitch = getPitchById(pitchId);
        pitch.setPricePerHour(pricePerHour);
        return pitchRepository.save(pitch);
    }

    private void validatePitchInput(String name, Pitch.PitchType pitchType,
            BigDecimal pricePerHour) throws PitchException {
        if (name == null || name.trim().length() < 2) {
            throw new PitchException("Tên sân phải có ít nhất 2 ký tự");
        }

        if (pitchType == null) {
            throw new PitchException("Loại sân không hợp lệ");
        }

        if (pricePerHour == null || pricePerHour.compareTo(BigDecimal.ZERO) <= 0) {
            throw new PitchException("Giá sân phải lớn hơn 0");
        }
    }

    public static class PitchException extends Exception {
        public PitchException(String message) {
            super(message);
        }
    }
}
