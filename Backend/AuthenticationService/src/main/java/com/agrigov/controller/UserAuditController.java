  package com.agrigov.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.agrigov.dto.UserDTO;
import com.agrigov.service.AuthService;

@RestController
@RequestMapping("/auth")
public class UserAuditController {

    private final AuthService authService;

    public UserAuditController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * INTERNAL – returns ONLY current user's ID
     */
    @GetMapping("/userForAudit")
    public UserDTO getCurrentUserId() {
        return authService.getCurrentUserId();
    }
}