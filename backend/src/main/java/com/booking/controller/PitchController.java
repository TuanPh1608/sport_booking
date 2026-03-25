package com.booking.controller;

import com.booking.entity.Pitch;
import com.booking.service.PitchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pitches")
@RequiredArgsConstructor
public class PitchController {
    private final PitchService pitchService;

    /**
     * POST /api/pitches - Tạo sân mới (chỉ ADMIN)
     */
    @PostMapping
    public ResponseEntity<?> createPitch(@RequestBody CreatePitchRequest request) {
        try {
            Pitch pitch = pitchService.createPitch(
                request.getName(),
                Pitch.PitchType.valueOf(request.getPitchType().toUpperCase()),
                request.getPricePerHour()
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                .body(formatPitch(pitch));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Lỗi tạo sân: " + e.getMessage()));
        }
    }

    /**
     * GET /api/pitches - Lấy danh sách tất cả sân khả dụng
     */
    @GetMapping
    public ResponseEntity<?> getAvailablePitches() {
        List<Pitch> pitches = pitchService.getAvailablePitches();
        return ResponseEntity.ok(Map.of(
            "total", pitches.size(),
            "pitches", pitches.stream().map(this::formatPitch).collect(Collectors.toList())
        ));
    }

    /**
     * GET /api/pitches/{id} - Lấy thông tin chi tiết sân
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getPitch(@PathVariable Long id) {
        try {
            Pitch pitch = pitchService.getPitchById(id);
            return ResponseEntity.ok(formatPitch(pitch));
        } catch (PitchService.PitchException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/pitches/type/{pitchType} - Lấy sân theo loại
     */
    @GetMapping("/type/{pitchType}")
    public ResponseEntity<?> getPitchesByType(@PathVariable String pitchType) {
        try {
            List<Pitch> pitches = pitchService.getPitchesByType(
                Pitch.PitchType.valueOf(pitchType.toUpperCase())
            );
            return ResponseEntity.ok(Map.of(
                "total", pitches.size(),
                "pitches", pitches.stream().map(this::formatPitch).collect(Collectors.toList())
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Loại sân không hợp lệ"));
        }
    }

    /**
     * PUT /api/pitches/{id}/status - Cập nhật trạng thái sân
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updatePitchStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            Pitch pitch = pitchService.updatePitchStatus(
                id,
                Pitch.PitchStatus.valueOf(request.get("status").toUpperCase())
            );
            return ResponseEntity.ok(formatPitch(pitch));
        } catch (PitchService.PitchException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Lỗi: " + e.getMessage()));
        }
    }

    /**
     * PUT /api/pitches/{id}/price - Cập nhật giá sân
     */
    @PutMapping("/{id}/price")
    public ResponseEntity<?> updatePitchPrice(
            @PathVariable Long id,
            @RequestBody Map<String, BigDecimal> request) {
        try {
            Pitch pitch = pitchService.updatePitchPrice(id, request.get("pricePerHour"));
            return ResponseEntity.ok(formatPitch(pitch));
        } catch (PitchService.PitchException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Helper method
    private Map<String, Object> formatPitch(Pitch pitch) {
        return Map.of(
            "id", pitch.getId(),
            "name", pitch.getName(),
            "pitchType", pitch.getPitchType().name(),
            "pricePerHour", pitch.getPricePerHour(),
            "status", pitch.getStatus().name()
        );
    }

    // DTO
    public static class CreatePitchRequest {
        private String name;
        private String pitchType;
        private BigDecimal pricePerHour;

        // Getters
        public String getName() { return name; }
        public String getPitchType() { return pitchType; }
        public BigDecimal getPricePerHour() { return pricePerHour; }
    }
}
