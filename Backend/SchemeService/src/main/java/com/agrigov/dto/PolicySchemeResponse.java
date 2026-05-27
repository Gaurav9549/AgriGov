package com.agrigov.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.agrigov.enums.SchemeStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PolicySchemeResponse {
	private Long schemeID;
	private String title;
	private String description;
	private LocalDate startDate;
	private LocalDate endDate;
	private Double budget;
	private SchemeStatus status;
}