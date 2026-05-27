package com.agrigov.dto;

import java.time.LocalDate;
import java.util.List;

import com.agrigov.model.FarmerStatus;

import lombok.Data;

@Data
public class FarmerResponse {

	private Long farmerId;
	private String name;
	private LocalDate dob;
	private String gender;
	private String address;
	private String contactInfo;
	private String landDetails;
	private FarmerStatus status;

	// Include documents
	private List<FarmerDocumentResponse> documents;


}
