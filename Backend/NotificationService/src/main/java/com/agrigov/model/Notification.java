package com.agrigov.model;

import java.time.LocalDateTime;

import com.agrigov.enums.NotificationCategory;
import com.agrigov.enums.NotificationStatus;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
@Table(
    name = "notifications",
    indexes = {
        @Index(name = "idx_farmer_notification", columnList = "farmerId")
    }
)
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    @NotNull(message = "Farmer ID is required")
    @Column(nullable = false)
    private Long farmerId;     // ✅ CHANGED

    private Long entityId;

    @NotBlank(message = "Message content is required")
    @Column(length = 500, nullable = false)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationStatus status;

    private LocalDateTime createdDate;
}