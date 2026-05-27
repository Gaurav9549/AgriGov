package com.agrigov.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.Data;

@Data
public class FarmerResponse {

	private Long farmerId;
	private String name;
	private LocalDate dob;
	private String email;
	private String gender;
	private String address;
	private String contactInfo;
	private String landDetails;
	private String status;
	

	// Include documents
	private List<FarmerDocumentResponse> documents;
}