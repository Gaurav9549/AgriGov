package com.agrigov.dto;

import java.time.LocalDate;

import com.agrigov.enums.SchemeStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PolicySchemeRequest {

    @NotBlank
    private String title;

    private String description;

    private LocalDate startDate;

    private LocalDate endDate;

    @NotNull
    private Double budget;
    
    private SchemeStatus status;
}