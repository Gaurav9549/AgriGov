package com.agrigov.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.agrigov.dto.UserDTO;

@FeignClient(
	    name = "AUTHENTICATIONSERVICE"
	)
	public interface UserClient {

	    @GetMapping("/auth/userForAudit")
	    UserDTO getCurrentUserId();
}
	