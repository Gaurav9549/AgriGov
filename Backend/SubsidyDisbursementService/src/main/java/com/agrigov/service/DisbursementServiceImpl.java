package com.agrigov.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.agrigov.client.DisbursementNotificationClient;
import com.agrigov.client.UserClient;
import com.agrigov.dto.DisbursementRequest;
import com.agrigov.dto.DisbursementResponse;
import com.agrigov.dto.NotificationRequest;
import com.agrigov.dto.UserSubsidyDTO;
import com.agrigov.enums.NotificationCategory;
import com.agrigov.enums.Role;
import com.agrigov.enums.SubsidyStatus;
import com.agrigov.exception.ConflictException;
import com.agrigov.exception.ResourceNotFoundException;
import com.agrigov.model.Disbursement;
import com.agrigov.model.Subsidy;
import com.agrigov.repository.DisbursementRepository;
import com.agrigov.repository.SubsidyRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class DisbursementServiceImpl implements DisbursementService {

    private final DisbursementRepository disbursementRepository;
    private final SubsidyRepository subsidyRepository;
    private final DisbursementNotificationClient notificationClient;
    private final UserClient userClient;

    // ---------------- CREATE ----------------

    @Override
    @Transactional
    public DisbursementResponse create(DisbursementRequest request) {

        Subsidy subsidy = subsidyRepository.findById(request.getSubsidyId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Subsidy not found: " + request.getSubsidyId()));

        if (subsidy.getStatus() != SubsidyStatus.APPROVED) {
            throw new IllegalStateException(
                    "Disbursement allowed only for APPROVED subsidies");
        }

        // ✅ OPTION 2: ENTITY-BASED DUPLICATE CHECK
        if (disbursementRepository.existsBySubsidy(subsidy)) {
            throw new ConflictException(
                    "Disbursement already completed for this subsidy");
        }

        // ✅ Officer validation
        UserSubsidyDTO officer = userClient.getCurrentUserRoleId();
        if (officer.getRole() != Role.RURALOFFICER) {
            throw new ResourceNotFoundException(
                    "Only RURAL OFFICER can disburse subsidy");
        }

        Disbursement entity = new Disbursement();
        entity.setSubsidy(subsidy);
        entity.setOfficerId(officer.getId());
        entity.setStatus("DISBURSED");

        entity = disbursementRepository.save(entity);

        log.info("Disbursement created successfully. ID={}",
                entity.getDisbursementId());

        triggerDisbursementNotification(entity);

        return toResponse(entity);
    }

    // ---------------- UPDATE ----------------

    @Override
    @Transactional
    public DisbursementResponse update(Long id, DisbursementRequest request) {

        Disbursement entity = disbursementRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Disbursement not found: " + id));

        if (request.getSubsidyId() != null) {
            Subsidy subsidy = subsidyRepository.findById(request.getSubsidyId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Subsidy not found: " + request.getSubsidyId()));
            entity.setSubsidy(subsidy);
        }

        return toResponse(entity);
    }

    // ---------------- READ ----------------

    @Override
    public DisbursementResponse getById(Long id) {
        return toResponse(findEntity(id));
    }

    @Override
    public List<DisbursementResponse> getAll() {
        return disbursementRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ---------------- DELETE ----------------

    @Override
    public void delete(Long id) {
        if (!disbursementRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Disbursement not found: " + id);
        }
        disbursementRepository.deleteById(id);
    }

    // ---------------- HELPERS ----------------

    private Disbursement findEntity(Long id) {
        return disbursementRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Disbursement not found: " + id));
    }

    private DisbursementResponse toResponse(Disbursement entity) {
        DisbursementResponse res = new DisbursementResponse();
        res.setDisbursementId(entity.getDisbursementId());
        res.setOfficerId(entity.getOfficerId());
        res.setSubsidyId(entity.getSubsidy().getSubsidyId());
        res.setDate(entity.getDate());
        res.setStatus(entity.getStatus());
        return res;
    }

    // ---------------- NOTIFICATION ----------------

    private void triggerDisbursementNotification(Disbursement entity) {
        try {
            NotificationRequest note = new NotificationRequest();
            note.setFarmerId(entity.getSubsidy().getFarmerId());
            note.setEntityId(entity.getDisbursementId());
            note.setCategory(NotificationCategory.SCHEME);
            note.setMessage(
                "Success! Your subsidy (ID: "
                + entity.getSubsidy().getSubsidyId()
                + ") has been successfully disbursed."
            );

            notificationClient.createNotification(note);

            log.info("Notification sent for disbursementId={}",
                    entity.getDisbursementId());

        } catch (Exception e) {
            log.warn("Notification failed for disbursementId={}",
                    entity.getDisbursementId(), e);
        }
    }
}
