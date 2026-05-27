package com.agrigov.controller;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.agrigov.dto.FarmerDocumentResponse;
import com.agrigov.service.FarmerDocumentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/documents")
@Slf4j
@RequiredArgsConstructor
public class FarmerDocumentController {

    private final FarmerDocumentService service;

    /**
     * Upload a document
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public FarmerDocumentResponse uploadDocument(
            @RequestParam("farmerId") Long farmerId,
            @RequestParam("docType") String docType,
            @RequestParam("file") MultipartFile file) {

        log.info("Received upload request for Farmer ID: {} - Type: {}", farmerId, docType);
        return service.uploadDocument(farmerId, docType, file);
    }

    /**
     * Get all documents by farmer ID
     */
    @GetMapping("/farmer/{farmerId}")
    public List<FarmerDocumentResponse> getDocumentsByFarmer(
            @PathVariable("farmerId") Long farmerId) {

        log.info("Fetching documents for farmer ID: {}", farmerId);
        return service.getDocumentsByFarmer(farmerId);
    }

    /**
     * Update document metadata or file
     */
    @PatchMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public FarmerDocumentResponse updateDocument(
            @PathVariable("id") Long documentId,
            @RequestParam(value = "docType", required = false) String docType,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        log.info("Updating document ID: {}", documentId);
        return service.updateDocument(documentId, docType, file);
    }

    /**
     * Delete document
     */
    @DeleteMapping("/delete/{id}")
    public String deleteDocument(@PathVariable("id") Long documentId) {

        log.warn("Deleting document ID: {}", documentId);
        service.deleteDocument(documentId);

        return "Document with ID " + documentId + " deleted successfully";
    }

    /**
     * Get document by ID
     */
    @GetMapping("/fetch/{id}")
    public FarmerDocumentResponse getDocumentById(
            @PathVariable("id") Long documentId) {

        return service.getDocumentById(documentId);
    }

    /**
     * Get documents by status
     */
    @GetMapping("/fetchByStatus/{status}")
    public List<FarmerDocumentResponse> getDocumentsByStatus(
            @PathVariable("status") String status) {

        return service.getDocumentsByStatus(status);
    }

    /**
     * Fetch file from local storage
     */
    @GetMapping("/files/{fileName}")
    public ResponseEntity<Resource> fetchFile(@PathVariable String fileName)
            throws IOException {

        Path filePath = Paths.get("uploads").resolve(fileName).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }

        MediaType mediaType = MediaTypeFactory
                .getMediaType(resource)
                .orElse(MediaType.APPLICATION_OCTET_STREAM);

        return ResponseEntity.ok()
                .contentType(mediaType)
                .body(resource);
    }
}