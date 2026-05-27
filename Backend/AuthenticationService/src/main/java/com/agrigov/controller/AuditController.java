package com.agrigov.controller;

import java.util.List;
import java.util.Map;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.agrigov.model.AuditLog;
import com.agrigov.service.AuditLogService;

@RestController
@RequestMapping("/audit")
public class AuditController {

    private final AuditLogService auditLogService;

    public AuditController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping("/{id}")
    public AuditLog getAuditById(@PathVariable Long id) {
        return auditLogService.getById(id);
    }

    @GetMapping
    public List<AuditLog> getAllAuditLogs() {
        return auditLogService.getAll();
    }
}