package com.agrigov.dto;
 
import com.agrigov.enums.Role;
 
import lombok.Data;
 
@Data
public class ForgotPasswordRequest {
 
	    private String name;
	    private String email;
	    private String phoneNumber;
	    private Role role;
	    private String newPassword;
	}