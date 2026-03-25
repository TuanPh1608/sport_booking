package com.booking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "pitches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pitch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "pitch_type", nullable = false)
    private PitchType pitchType;

    @Column(name = "price_per_hour", nullable = false)
    private BigDecimal pricePerHour;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PitchStatus status;

    // Loại sân
    public enum PitchType {
        FIVE_PLAYER,    // Sân 5 người
        SEVEN_PLAYER,   // Sân 7 người
        ELEVEN_PLAYER   // Sân 11 người
    }

    // Trạng thái sân
    public enum PitchStatus {
        AVAILABLE,      // Đang hoạt động
        MAINTENANCE     // Đang bảo trì
    }
}
