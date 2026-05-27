package com.agrigov.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.agrigov.dto.FarmerDocumentResponse;
import com.agrigov.dto.FarmerRequest;
import com.agrigov.dto.FarmerResponse;
import com.agrigov.exception.ResourceNotFoundException;
import com.agrigov.model.Farmer;
import com.agrigov.model.FarmerStatus; // Correct Enum Import
import com.agrigov.repository.FarmerRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class FarmerServiceImpl implements FarmerService {

	private final FarmerRepository repository;
	private final FarmerDocumentClient documentClient; // Injected Feign Client

	@Override
	@Transactional
	public FarmerResponse registerFarmer(FarmerRequest farmerRequest) {
		log.info("Registering farmer: {}", farmerRequest.getName());

		Farmer farmer = new Farmer();
		farmer.setName(farmerRequest.getName());
		farmer.setDob(farmerRequest.getDob());
		farmer.setEmail(farmerRequest.getEmail());
		farmer.setGender(farmerRequest.getGender());
		farmer.setAddress(farmerRequest.getAddress());
		farmer.setContactInfo(farmerRequest.getContactInfo());
		farmer.setLandDetails(farmerRequest.getLandDetails());
		
		// Use FarmerStatus enum constant
		farmer.setStatus(FarmerStatus.ACTIVE);

		Farmer saved = repository.save(farmer);
		return mapToResponse(saved);
	}

	@Override
	@Transactional
	public FarmerResponse partialUpdateFarmer(FarmerRequest farmerRequest, Long farmerId) {
		Farmer farmer = repository.findById(farmerId)
				.orElseThrow(() -> new ResourceNotFoundException("Farmer not found with ID: " + farmerId));

		if (farmerRequest.getName() != null)
			farmer.setName(farmerRequest.getName());
		if (farmerRequest.getDob() != null)
			farmer.setDob(farmerRequest.getDob());
		if (farmerRequest.getEmail() != null)
			farmer.setEmail(farmerRequest.getEmail());
		if (farmerRequest.getGender() != null)
			farmer.setGender(farmerRequest.getGender());
		if (farmerRequest.getAddress() != null)
			farmer.setAddress(farmerRequest.getAddress());
		if (farmerRequest.getContactInfo() != null)
			farmer.setContactInfo(farmerRequest.getContactInfo());
		if (farmerRequest.getLandDetails() != null)
			farmer.setLandDetails(farmerRequest.getLandDetails());

		return fetchAndMap(repository.save(farmer));
	}

	@Override
	public void deleteFarmer(Long farmerId) {
		if (!repository.existsById(farmerId)) {
			throw new ResourceNotFoundException("Farmer not found with ID: " + farmerId);
		}
		repository.deleteById(farmerId);
		log.info("Farmer with ID {} deleted", farmerId);
	}

	@Override
	public FarmerResponse getFarmerById(Long farmerId) {
		log.debug("Fetching farmer by ID: {}", farmerId);
		Farmer farmer = repository.findById(farmerId)
				.orElseThrow(() -> new ResourceNotFoundException("Farmer not found with ID: " + farmerId));

		return fetchAndMap(farmer);
	}

	@Override
	public List<FarmerResponse> getAllFarmers() {
		log.debug("Fetching all farmers");
		return repository.findAll().stream()
				.map(this::fetchAndMap) 
				.collect(Collectors.toList());
	}

	@Override
	public List<FarmerResponse> getFarmersByStatus(String status) {
		log.info("Fetching farmers with status: {}", status);

		// FIX: Convert String input to FarmerStatus enum safely
		FarmerStatus searchStatus = FarmerStatus.valueOf(status.toUpperCase());
		
		List<Farmer> farmers = repository.findByStatus(searchStatus);

		if (farmers.isEmpty()) {
			throw new ResourceNotFoundException("No farmers found with status: " + status);
		}

		return farmers.stream()
				.map(this::fetchAndMap)
				.collect(Collectors.toList());
	}

	/**
	 * Helper method to map Entity to Response and fetch documents via Feign
	 */
	private FarmerResponse fetchAndMap(Farmer farmer) {
		FarmerResponse response = mapToResponse(farmer);
		try {
			List<FarmerDocumentResponse> docs = documentClient.getDocumentsByFarmerId(farmer.getFarmerId());
			response.setDocuments(docs);
		} catch (Exception e) {
			log.warn("FarmerDocumentService unreachable for farmer ID {}", farmer.getFarmerId());
		}
		return response;
	}

	/**
	 * Manual Mapper: Entity -> DTO
	 */
	private FarmerResponse mapToResponse(Farmer farmer) {
		FarmerResponse res = new FarmerResponse();
		res.setFarmerId(farmer.getFarmerId());
		res.setName(farmer.getName());
		res.setDob(farmer.getDob());
		res.setEmail(farmer.getEmail());
		res.setGender(farmer.getGender());
		res.setAddress(farmer.getAddress());
		res.setContactInfo(farmer.getContactInfo());
		res.setLandDetails(farmer.getLandDetails());

		// Map Enum to the DTO field (Matches if DTO status is FarmerStatus or String.name())
		res.setDocuments(new java.util.ArrayList<>());
		if (farmer.getStatus() != null) {
			res.setStatus(farmer.getStatus()); 
		}
		return res;
	}
}