package com.agrigov.dto;

import java.time.LocalDate;

import com.agrigov.enums.SchemeStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SchemeApplicationResponse {

	private Long applicationID;
	private Long farmerID;
	private Long schemeID;
	private LocalDate submittedDate;
	private SchemeStatus status;
	private String message;
}