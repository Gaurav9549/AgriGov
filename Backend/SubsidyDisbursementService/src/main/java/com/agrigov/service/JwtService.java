package com.agrigov.service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final Key accessKey;

    public JwtService(@Value("${jwt.access.secret}") String accessSecret) {
        this.accessKey =
            Keys.hmacShaKeyFor(accessSecret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Validate JWT signature, expiry, structure
     */
    public boolean isTokenValid(String token) {
        try {
            Claims claims = extractAllClaims(token);

            // Optional: ensure this is an ACCESS token
            String type = claims.get("typ", String.class);
            if (!"access".equals(type)) {
                return false;
            }

            return !isTokenExpired(claims);

        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Extract username (email) from JWT subject
     */
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    /**
     * Extract userId from token if needed for future use
     */
    public Long extractUserId(String token) {
        return extractAllClaims(token).get("uid", Long.class);
    }

    /**
     * Extract role from token if needed later
     */
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    /* =================== HELPER METHODS =================== */

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(accessKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private boolean isTokenExpired(Claims claims) {
        Date expiration = claims.getExpiration();
        return expiration.before(new Date());
    }
}
