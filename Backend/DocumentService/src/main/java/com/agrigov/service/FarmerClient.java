package com.agrigov.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.agrigov.dto.FarmerResponse;

// Use the name from Eureka: "FARMERSERVICE"
@FeignClient(name = "FARMERSERVICE") 
public interface FarmerClient {

    // Ensure this path matches the mapping in your FarmerController
    @GetMapping("/farmers/fetch/{id}") 
    FarmerResponse getFarmerById(@PathVariable("id") Long id);
}