package com.agrigov.security;
 
import java.io.IOException;
import java.util.Collections;
 
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
 
import com.agrigov.service.JwtService;
 
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
 
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
 
    private final JwtService jwtService;
 
    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }
 
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

 
    	 String path = request.getServletPath();
    	    if (path.equals("/auth/forgot-password")) {
    	        filterChain.doFilter(request, response);
    	        return;
    	    }
 
 
        String header = request.getHeader("Authorization");
 
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response); 
            return;
        }

 
        String token = header.substring(7);
 
        if (!jwtService.isTokenValid(token)) {
            filterChain.doFilter(request, response);
            return;
        }
 
        String email = jwtService.extractUsername(token);
 
        UsernamePasswordAuthenticationToken authentication =new UsernamePasswordAuthenticationToken(
        	    email,
        	    token, // ✅ store JWT here
        	    Collections.emptyList()
        	);
 
        SecurityContextHolder.getContext().setAuthentication(authentication);
 
        filterChain.doFilter(request, response);
    }
}