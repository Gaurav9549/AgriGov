package com.agrigov.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.agrigov.dto.FarmerDocumentResponse;
import com.agrigov.exception.ResourceNotFoundException;
import com.agrigov.model.DocumentStatus; // Import correct Enum
import com.agrigov.model.FarmerDocument;
import com.agrigov.repository.FarmerDocumentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Transactional
@Service
@Slf4j
@RequiredArgsConstructor
public class FarmerDocumentServiceImpl implements FarmerDocumentService {

	private final FarmerDocumentRepository documentRepository;
	private final FarmerClient farmerClient; 

	@Value("${file.upload-dir:uploads}")
	private String uploadDir;

	@Override
	public FarmerDocumentResponse uploadDocument(Long farmerId, String docType, MultipartFile file) {
		// 1. Validate Farmer first via Feign
		try {
			farmerClient.getFarmerById(farmerId);
		} catch (Exception e) {
			log.error("Validation failed. Error: {}", e.getMessage());
			throw new ResourceNotFoundException("Farmer not found with ID: " + farmerId);
		}
		try {
			Files.createDirectories(Paths.get(uploadDir));
			String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
			Path filePath = Paths.get(uploadDir, fileName);
			Files.write(filePath, file.getBytes());

			FarmerDocument document = new FarmerDocument();
			document.setFarmerId(farmerId);
			document.setDocType(docType);
			document.setFileUri(fileName);
			document.setUploadedDate(LocalDate.now());
			document.setVerificationStatus(DocumentStatus.PENDING); // Used DocumentStatus

			FarmerDocument saved = documentRepository.save(document);
			return toResponse(saved);

		} catch (IOException e) {
			log.error("Error saving file: {}", e.getMessage());
			throw new RuntimeException("File upload failed: " + e.getMessage());
		}
	}

	@Override
	public FarmerDocumentResponse updateDocument(Long documentId, String docType, String status) {
		FarmerDocument existing = documentRepository.findById(documentId)
				.orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + documentId));

		if (docType != null) {
			existing.setDocType(docType);
		}
		// FIX: Convert the incoming string to DocumentStatus enum
		if (status != null) {
			existing.setVerificationStatus(DocumentStatus.valueOf(status.toUpperCase()));
		}

		return toResponse(documentRepository.save(existing));
	}

	@Override
	public FarmerDocumentResponse updateDocument(Long documentId, String docType, MultipartFile file) {
		FarmerDocument existing = documentRepository.findById(documentId)
				.orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + documentId));

		try {
			if (file != null && !file.isEmpty()) {
				Files.deleteIfExists(Paths.get(uploadDir, existing.getFileUri()));
				String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
				Path newFilePath = Paths.get(uploadDir, fileName);
				Files.write(newFilePath, file.getBytes());

				existing.setFileUri(fileName);
				existing.setUploadedDate(LocalDate.now());
			}

			if (docType != null) {
				existing.setDocType(docType);
			}

			existing.setVerificationStatus(DocumentStatus.PENDING); 

			return toResponse(documentRepository.save(existing));

		} catch (IOException e) {
			log.error("Error updating file: {}", e.getMessage());
			throw new RuntimeException("File update failed: " + e.getMessage());
		}
	}

	@Override
	public void deleteDocument(Long documentId) {
		FarmerDocument doc = documentRepository.findById(documentId)
				.orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + documentId));

		try {
			Files.deleteIfExists(Paths.get(uploadDir, doc.getFileUri()));
		} catch (IOException e) {
			log.warn("Failed to delete physical file: {}", doc.getFileUri());
		}

		documentRepository.deleteById(documentId);
	}

	@Override
	public FarmerDocumentResponse getDocumentById(Long documentId) {
		return documentRepository.findById(documentId).map(this::toResponse)
				.orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + documentId));
	}

	@Override
	public List<FarmerDocumentResponse> getDocumentsByFarmer(Long farmerId) {
		return documentRepository.findByFarmerId(farmerId).stream().map(this::toResponse).toList();
	}

	@Override
	public List<FarmerDocumentResponse> getDocumentsByStatus(String status) {
		// FIX: Use DocumentStatus instead of Status
		DocumentStatus searchStatus = DocumentStatus.valueOf(status.toUpperCase());
		return documentRepository.findByVerificationStatus(searchStatus).stream().map(this::toResponse).toList();
	}

	private FarmerDocumentResponse toResponse(FarmerDocument doc) {
		FarmerDocumentResponse response = new FarmerDocumentResponse();
		response.setDocumentId(doc.getDocumentId());
		response.setFarmerId(doc.getFarmerId());
		response.setDocType(doc.getDocType());
		response.setFileUri(doc.getFileUri());
		response.setUploadedDate(doc.getUploadedDate());
		response.setVerificationStatus(doc.getVerificationStatus().name());
		return response;
	}
}