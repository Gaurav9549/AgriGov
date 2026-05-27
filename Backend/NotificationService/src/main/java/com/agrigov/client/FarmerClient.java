package com.agrigov.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.agrigov.dto.FarmerResponse;

@FeignClient(name = "FARMERSERVICE", contextId = "notificationFarmerClient")
public interface FarmerClient {

    @GetMapping("/farmers/fetch/{id}")
    FarmerResponse getFarmerById(@PathVariable("id") Long farmerId);
}