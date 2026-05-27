package com.agrigov.dto;

import com.agrigov.enums.NotificationCategory;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NotificationRequest {

    @NotNull(message = "Farmer ID is required")
    private Long farmerId;

    @Email(message = "Invalid email format")
    private String email; // optional – can be resolved from FarmerService

    private Long entityId;

    @NotBlank(message = "Message content is required")
    private String message;

    @NotNull(message = "Category is required")
    private NotificationCategory category;
}