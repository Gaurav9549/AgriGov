package com.agrigov.service;
 
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
 
import com.agrigov.security.JwtAuthenticationFilter;
 
@Configuration
@EnableWebSecurity
public class SecurityConfig {
 
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
 
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }
 
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
 
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
 
                /* ===============================
                 * ✅ CHANGE #1: ADD forgot-password
                 * =============================== */
                .requestMatchers(
                	"/api/notifications/**",
                	"/farmers/**",
                    "/auth/login",
                    "/auth/register",
                    "/auth/refresh",
                    "/auth/forgot-password",   // ✅ ADD THIS
                    "/api/audits",
                    "/documents/upload",
                    "/audit/**",
                    "/api/compliance-records"
                ).permitAll()
 
                /* ===============================
                 * EXISTING (UNCHANGED)
                 * =============================== */
                .requestMatchers("/auth/userForAudit").authenticated()
 
                /* ===============================
                 * KEEP THIS
                 * =============================== */
                .anyRequest().authenticated()
            );
 
        /* ===============================
         * KEEP JWT FILTER (UNCHANGED)
         * =============================== */
        http.addFilterBefore(
            jwtAuthenticationFilter,
            UsernamePasswordAuthenticationFilter.class
        );
 
        return http.build();
    }
}