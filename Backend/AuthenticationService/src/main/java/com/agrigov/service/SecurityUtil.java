package com.agrigov.service;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import lombok.extern.slf4j.Slf4j;

/**
 * Utility class to extract the currently authenticated user's identity from the
 * Spring Security context.
 *
 * This works because JWT authentication has already populated the context.
 */
@Slf4j
public final class SecurityUtil {

	private SecurityUtil() {
	}

	public static String getCurrentUserEmail() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		log.info("Auth object: {}", authentication);
		log.info("Auth class: {}", authentication.getClass());
		log.info("Principal: {}", authentication.getPrincipal());

		if (authentication == null ||
			    authentication instanceof AnonymousAuthenticationToken) {
			    return null;
			}

		return authentication.getName(); // JWT subject (email)
	}
}
