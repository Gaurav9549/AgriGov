package com.agrigov.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.agrigov.dto.SchemeApplicationRequest;
import com.agrigov.dto.SchemeApplicationResponse;
import com.agrigov.service.SchemeApplicationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/application")
public class SchemeApplicationController {

	private final SchemeApplicationService service;

	public SchemeApplicationController(SchemeApplicationService service) {
		this.service = service;
	}

	// Create

	@PostMapping("/save")
	@ResponseStatus(HttpStatus.CREATED)
	public SchemeApplicationResponse create(@Valid @RequestBody SchemeApplicationRequest request) {
		return service.create(request);
	}

	// Get All Application

	@GetMapping("/all")
	public List<SchemeApplicationResponse> getAllApplications() {
		return service.getAllApplications();
	}

	// Get All Scheme by Farmer Id

	@GetMapping("/farmer/{farmerID}")
	public List<SchemeApplicationResponse> getByFarmerId(@PathVariable Long farmerID) {
		return service.getByFarmerId(farmerID);
	}

	// Get All Application by Scheme Id

	@GetMapping("/scheme/{schemeID}")
	public List<SchemeApplicationResponse> getAppliedBySchemeId(@PathVariable Long schemeID) {
		return service.getAppliedBySchemeId(schemeID);
	}

	// Get by Application Id

	@GetMapping("/{applicationID}")
	public SchemeApplicationResponse getById(@PathVariable Long applicationID) {
		return service.getById(applicationID);
	}

	// Update Scheme Apllication

	@PutMapping("/{applicationID}")
	public SchemeApplicationResponse update(@PathVariable Long applicationID,
			@Valid @RequestBody SchemeApplicationRequest request) {

		return service.update(applicationID, request);
	}

	// Delete Scheme Application

	@DeleteMapping("/{applicationID}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteappl(@PathVariable Long applicationID) {
		service.deleteappl(applicationID);
	}
}