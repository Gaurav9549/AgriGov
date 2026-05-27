package com.agrigov.client;
 
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
 
import com.agrigov.dto.UserSubsidyDTO;
 
@FeignClient(name = "AUTHENTICATIONSERVICE")
public interface UserClient {
 
	@GetMapping("/auth/userForDisbursement")
	UserSubsidyDTO getCurrentUserRoleId();
}