package com.agrigov.dto;

import java.time.Instant;

import lombok.Data;

@Data
public class UserResponse {

	private Long id;
	private String name;
	private String email;
	private String phoneNumber;
	private String role;
	private String status;
	private Instant lastLoginAt;
}
