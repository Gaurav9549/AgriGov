package com.agrigov.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.agrigov.client.FarmerClient;
import com.agrigov.client.SchemeNotificationClient;
import com.agrigov.dto.FarmerResponse;
import com.agrigov.dto.NotificationRequest;
import com.agrigov.dto.SchemeApplicationRequest;
import com.agrigov.dto.SchemeApplicationResponse;
import com.agrigov.enums.NotificationCategory;
import com.agrigov.exception.SchemeApplicationNotFoundException;
import com.agrigov.model.PolicyScheme;
import com.agrigov.model.SchemeApplication;
import com.agrigov.repository.PolicySchemeRepository;
import com.agrigov.repository.SchemeApplicationRepository;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@Slf4j
public class SchemeApplicationServiceImpl implements SchemeApplicationService {

	private final SchemeApplicationRepository schemeApplicationRepository;
	private final PolicySchemeRepository policySchemeRepository;
	private final SchemeNotificationClient schemeNotificationClient;
	private final FarmerClient farmerClient;

	public SchemeApplicationServiceImpl(SchemeApplicationRepository schemeApplicationRepository,
			PolicySchemeRepository policySchemeRepository, SchemeNotificationClient schemeNotificationClient,
			FarmerClient farmerClient) {

		this.schemeApplicationRepository = schemeApplicationRepository;
		this.policySchemeRepository = policySchemeRepository;
		this.schemeNotificationClient = schemeNotificationClient;
		this.farmerClient = farmerClient;
	}

	// Create

	@Override
	@CircuitBreaker(name = "SchemeServiceApplication", fallbackMethod = "createFallback")
	public SchemeApplicationResponse create(SchemeApplicationRequest request) {
		log.info("Processing application for Farmer ID={} Scheme ID={}", request.getFarmerID(), request.getSchemeID());

		validateFarmerEligibility(request.getFarmerID());

		PolicyScheme policyScheme = policySchemeRepository.findById(request.getSchemeID())
				.orElseThrow(() -> new SchemeApplicationNotFoundException(
						"PolicyScheme not found for ID: " + request.getSchemeID()));

		SchemeApplication schemeApplication = new SchemeApplication();
		schemeApplication.setPolicyscheme(policyScheme);
		schemeApplication.setFarmerID(request.getFarmerID());
		schemeApplication.setStatus(request.getStatus());
		schemeApplication.setSubmittedDate(
				request.getSubmittedDate() != null ? request.getSubmittedDate() : java.time.LocalDate.now());

		schemeApplication = schemeApplicationRepository.save(schemeApplication);
		triggerNotification(schemeApplication);

		return toResponse(schemeApplication);
	}

	// FallBack Method

	public SchemeApplicationResponse createFallback(SchemeApplicationRequest request, Throwable ex) {

		log.error("Fallback triggered for FarmerID={} SchemeID={} Reason={}", request.getFarmerID(),
				request.getSchemeID(), ex.getMessage());

		SchemeApplicationResponse fallback = new SchemeApplicationResponse();

		fallback.setApplicationID(null);
		fallback.setFarmerID(request.getFarmerID());
		fallback.setSchemeID(request.getSchemeID());
		fallback.setStatus(null);
		fallback.setSubmittedDate(null);

		fallback.setMessage("Your application could not be submitted right now. Please try again later.");

		return fallback;
	}

	// Update SchemeApplication

	@Override
	public SchemeApplicationResponse update(Long applicationID, SchemeApplicationRequest request) {
		SchemeApplication schemeApplication = schemeApplicationRepository.findById(applicationID).orElseThrow(
				() -> new SchemeApplicationNotFoundException("Scheme application not found for ID: " + applicationID));

		if (request.getStatus() != null) {
			schemeApplication.setStatus(request.getStatus());
		}

		if (request.getSchemeID() != null) {
			PolicyScheme newScheme = policySchemeRepository.findById(request.getSchemeID())
					.orElseThrow(() -> new SchemeApplicationNotFoundException(
							"PolicyScheme not found for ID: " + request.getSchemeID()));
			schemeApplication.setPolicyscheme(newScheme);
		}

		return toResponse(schemeApplicationRepository.save(schemeApplication));
	}

	// Read

	@Override
	@Transactional(readOnly = true)
	public List<SchemeApplicationResponse> getAppliedBySchemeId(Long schemeID) {
		if (!policySchemeRepository.existsById(schemeID)) {
			throw new SchemeApplicationNotFoundException("PolicyScheme not found for ID: " + schemeID);
		}

		return schemeApplicationRepository.findByPolicyscheme_SchemeID(schemeID).stream().map(this::toResponse)
				.collect(Collectors.toList());
	}

	@Override
	@Transactional(readOnly = true)
	public List<SchemeApplicationResponse> getByFarmerId(Long farmerID) {
		log.info("Fetching applications for Farmer ID: {}", farmerID);

		return schemeApplicationRepository.findByFarmerID(farmerID).stream().map(this::toResponse)
				.collect(Collectors.toList());
	}

	@Override
	@Transactional(readOnly = true)
	public List<SchemeApplicationResponse> getAllApplications() {
		return schemeApplicationRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
	}

	@Override
	@Transactional(readOnly = true)
	public SchemeApplicationResponse getById(Long applicationID) {
		return schemeApplicationRepository.findById(applicationID).map(this::toResponse).orElseThrow(
				() -> new SchemeApplicationNotFoundException("Scheme application not found for ID: " + applicationID));
	}

	// Delete

	@Override
	public void deleteappl(Long applicationID) {
		if (!schemeApplicationRepository.existsById(applicationID)) {
			throw new SchemeApplicationNotFoundException(
					"Cannot delete: Application not found for ID: " + applicationID);
		}
		schemeApplicationRepository.deleteById(applicationID);
		log.info("Deleted Scheme Application ID={}", applicationID);
	}

	// Private Helpers

	private void validateFarmerEligibility(Long farmerId) {
		try {
			FarmerResponse farmer = farmerClient.getFarmerById(farmerId);
			if (farmer == null) {
				throw new SchemeApplicationNotFoundException("Farmer verification failed: Farmer does not exist.");
			}
			if (!"ACTIVE".equalsIgnoreCase(farmer.getStatus())) {
				throw new IllegalStateException("Farmer is not eligible. Current status: " + farmer.getStatus());
			}
		} catch (Exception e) {
			log.error("Error verifying farmer ID {}: {}", farmerId, e.getMessage());
			throw new SchemeApplicationNotFoundException("Invalid Farmer: Could not verify identity.");
		}
	}

	// Trigger Notification

	private void triggerNotification(SchemeApplication entity) {
		try {
			NotificationRequest note = new NotificationRequest();
			note.setFarmerId(entity.getFarmerID());
			note.setEntityId(entity.getApplicationID());
			note.setMessage("Your application for " + entity.getPolicyscheme().getTitle()
					+ " has been successfully submitted.");
			note.setCategory(NotificationCategory.SCHEME);

			schemeNotificationClient.createNotification(note);
			log.info("Notification triggered for application ID={}", entity.getApplicationID());
		} catch (Exception e) {
			log.warn("Notification service unreachable for application ID {}. Error={}", entity.getApplicationID(),
					e.getMessage());
		}
	}

	private SchemeApplicationResponse toResponse(SchemeApplication s) {
		SchemeApplicationResponse r = new SchemeApplicationResponse();
		r.setApplicationID(s.getApplicationID());
		r.setFarmerID(s.getFarmerID());
		r.setSchemeID(s.getPolicyscheme().getSchemeID());
		r.setStatus(s.getStatus());
		r.setSubmittedDate(s.getSubmittedDate());
		return r;
	}
}