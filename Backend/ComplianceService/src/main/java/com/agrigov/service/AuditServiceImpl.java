package com.agrigov.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.agrigov.client.UserClient;
import com.agrigov.dto.AuditRequest;
import com.agrigov.dto.AuditResponse;
import com.agrigov.dto.UserDTO;
import com.agrigov.exceptions.ResourceNotFoundException;
import com.agrigov.model.Audit;
import com.agrigov.repository.AuditRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
public class AuditServiceImpl implements AuditService {

    private final AuditRepository auditRepository;
    private final UserClient client;

    // ✅ Constructor Injection
    public AuditServiceImpl(AuditRepository auditRepository, UserClient client) {
        this.auditRepository = auditRepository;
        this.client = client;
    }

    @Override
    public AuditResponse create(AuditRequest request) {

        log.info("creating new audit");

        Audit ad = new Audit();

        // ✅ CALL AUTHENTICATIONSERVICE
        UserDTO dto = client.getCurrentUserId();

        // ✅ SAFETY CHECK
        if (dto == null || dto.getId() == null) {
            throw new IllegalStateException(
                "Unable to fetch current user ID from AUTHENTICATIONSERVICE"
            );
        }

        // ✅ CORRECT METHOD CALL
        ad.setUserId(dto.getId());

        applyPatch(ad, request);

        ad = auditRepository.saveAndFlush(ad);

        return toResponse(ad);
    }

    @Override
    @Transactional
    public AuditResponse update(Long auditId, AuditRequest request) {

        log.info("updating audit");

        Audit ad = auditRepository.findById(auditId)
                .orElseThrow(() -> new ResourceNotFoundException("Audit not found: " + auditId));

        applyPatch(ad, request);

        try {
            ad = auditRepository.saveAndFlush(ad);
        } catch (DataIntegrityViolationException ex) {
            String msg = ex.getMostSpecificCause() != null
                    ? ex.getMostSpecificCause().getMessage()
                    : ex.getMessage();
            throw new IllegalArgumentException("Invalid Audit update: " + msg, ex);
        }

        return toResponse(ad);
    }

    @Override
    @Transactional(readOnly = true)
    public AuditResponse get(Long auditId) {
        log.info("getting audit");

        Audit ad = auditRepository.findById(auditId)
                .orElseThrow(() -> new ResourceNotFoundException("Audit not found: " + auditId));

        return toResponse(ad);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditResponse> getAll() {
        log.info("getting all audits");

        return auditRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AuditResponse delete(Long auditId) {

        Audit ad = auditRepository.findById(auditId)
                .orElseThrow(() -> new ResourceNotFoundException("Audit not found: " + auditId));

        auditRepository.delete(ad);
        log.info("deleted audit");

        return toResponse(ad);
    }

    private void applyPatch(Audit ad, AuditRequest req) {

        if (req.getScope() != null)
            ad.setScope(req.getScope());

        if (req.getFindings() != null)
            ad.setFindings(req.getFindings());

        if (req.getStatus() != null)
            ad.setStatus(req.getStatus());
    }

    private AuditResponse toResponse(Audit ad) {
        AuditResponse r = new AuditResponse();
        r.setAuditId(ad.getAuditId());
        r.setUserId(ad.getUserId());
        r.setScope(ad.getScope());
        r.setFindings(ad.getFindings());
        r.setDate(ad.getDate());
        r.setStatus(ad.getStatus());
        return r;
    }
}