
package com.agrigov.controller;
 
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.agrigov.dto.UserSubsidyDTO;
import com.agrigov.service.AuthService;

import lombok.RequiredArgsConstructor;
 
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class UserSubsidyController {
 
	private final AuthService authService;
 
	@GetMapping("/userForDisbursement")
	public UserSubsidyDTO getCurrentUserRoleId() {
		return authService.getCurrentUserRoleId();
	}

}