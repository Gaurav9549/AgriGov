package com.agrigov.service;

import java.util.List;

import com.agrigov.dto.AuthRequest;
import com.agrigov.dto.AuthResponse;
import com.agrigov.dto.ForgotPasswordRequest;
import com.agrigov.dto.RefreshTokenRequest;
import com.agrigov.dto.RegisterRequest;
import com.agrigov.dto.UserDTO;
import com.agrigov.dto.UserRequest;
import com.agrigov.dto.UserResponse;
import com.agrigov.dto.UserSubsidyDTO;
import com.agrigov.enums.Status;

public interface AuthService {

	AuthResponse login(AuthRequest request);

	AuthResponse refresh(RefreshTokenRequest request);

	void logout(String refreshToken);

	UserResponse  register(RegisterRequest request);

	void changePassword( String newPassword);

	void deleteUser(Long id);

	UserResponse getUserById(Long id);

	List<UserResponse> getAllUsers();

	UserResponse updateUser(Long id, UserRequest request);
	
	UserDTO getCurrentUserId();

	UserSubsidyDTO getCurrentUserRoleId();
	
	// Add these signatures to your existing interface
	void updateStatus(Long id, Status status);
	void forgotPassword(ForgotPasswordRequest request);
}
