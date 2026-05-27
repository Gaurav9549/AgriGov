package com.agrigov.interceptor;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import feign.RequestInterceptor;
import feign.RequestTemplate;

@Configuration
public class FeignAuthInterceptor implements RequestInterceptor {

    @Override
    public void apply(RequestTemplate template) {

        Authentication auth =
            SecurityContextHolder.getContext().getAuthentication();

        if (auth != null &&
            auth.isAuthenticated() &&
            !(auth instanceof AnonymousAuthenticationToken)) {

            Object credentials = auth.getCredentials();

            if (credentials instanceof String jwtToken) {
                template.header("Authorization", "Bearer " + jwtToken);
            }
        }
    }
}
