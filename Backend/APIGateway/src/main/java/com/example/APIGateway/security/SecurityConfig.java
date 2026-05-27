package com.example.APIGateway.security;

import org.springframework.context.annotation.Bean;

import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;

import org.springframework.security.config.web.server.SecurityWebFiltersOrder;

import org.springframework.security.config.web.server.ServerHttpSecurity;

import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration

@EnableWebFluxSecurity

public class SecurityConfig {

	private final JwtAuthenticationFilter jwtFilter;

	private final JwtAuthenticationEntryPoint entryPoint;

	public SecurityConfig(JwtAuthenticationFilter jwtFilter, JwtAuthenticationEntryPoint entryPoint) {

		this.jwtFilter = jwtFilter;

		this.entryPoint = entryPoint;

	}

	@Bean

	public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {

		return http

				// Gateway is stateless

				.csrf(ServerHttpSecurity.CsrfSpec::disable)

				// Handle auth failures

				.exceptionHandling(ex -> ex.authenticationEntryPoint(entryPoint))

				// Authorization rules

				.authorizeExchange(auth -> auth

//						.pathMatchers("/auth/**", "/actuator/**","/audit/**").permitAll()

						.pathMatchers("/auth/**", "/actuator/**", "/fallback/**", "/error", "/audit/**").permitAll()

						.pathMatchers("/admin/**").hasRole("ADMIN")

						.pathMatchers("/auth/users/*/status").hasRole("ADMIN")

						.pathMatchers("/documents/upload").hasRole("FARMER")

						// FARMER, OFFICER, MANAGER, ADMIN, AUDITOR

						.pathMatchers("/farmers/**").permitAll()

						.pathMatchers("/api/audits/**").hasAnyRole("ADMIN", "COMPLAINCEOFFICER", "AUDITOR")

						.pathMatchers("/api/compliance-records/**").hasAnyRole("ADMIN", "COMPLAINCEOFFICER", "AUDITOR")

						.pathMatchers("/api/reports/**").hasAnyRole("ADMIN", "COMPLAINCEOFFICER", "AUDITOR")

						.pathMatchers("/documents/**").hasAnyRole("ADMIN", "RURALOFFICER")

						.pathMatchers("/api/notifications/**").hasRole("FARMER")

						.pathMatchers("/api/rural-projects/**").hasAnyRole("ADMIN", "MANAGER", "COMPLAINCEOFFICER")

						.pathMatchers("/api/resources/**").hasAnyRole("ADMIN", "/api/audits", "MANAGER", "AUDITOR")

						.pathMatchers("/api/milestones/**")
						.hasAnyRole("ADMIN", " COMPLAINCEOFFICER", "MANAGER", "AUDITOR")

						// .pathMatchers("/policy/**").hasRole("ADMIN")

						.anyExchange().authenticated())

				// JWT filter

				.addFilterAt(jwtFilter, SecurityWebFiltersOrder.AUTHENTICATION)

				.build();

	}

}
