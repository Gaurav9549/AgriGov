package com.agrigov.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.agrigov.model.DocumentStatus;
import com.agrigov.model.FarmerDocument;

public interface FarmerDocumentRepository extends JpaRepository<FarmerDocument, Long> {
    List<FarmerDocument> findByFarmerId(Long farmerId);
    List<FarmerDocument> findByVerificationStatus(DocumentStatus status);
}