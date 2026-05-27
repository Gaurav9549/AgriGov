package com.agrigov.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.agrigov.dto.NotificationRequest;
import com.agrigov.dto.NotificationResponse;
import com.agrigov.service.NotificationService;

import jakarta.validation.Valid;

@RestController

@RequestMapping("/notifications")
public class NotificationController {

	@Autowired
	private NotificationService notificationService;

	// Send Notification

	@PostMapping("/send")
	public ResponseEntity<NotificationResponse> createNotification(@Valid @RequestBody NotificationRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(notificationService.createNotification(request));
	}

	// Get All Notification By Farmer Id

	@GetMapping("/farmer/{farmerId}")
	public ResponseEntity<List<NotificationResponse>> getUserNotifications(@PathVariable("farmerId") Long farmerId,
			@PageableDefault(size = 20, sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable) {

		return ResponseEntity.ok(notificationService.getFarmerNotifications(farmerId, pageable).getContent());
	}

	// Get All Notification

	@GetMapping
	public ResponseEntity<Page<NotificationResponse>> getAllNotifications(
			@PageableDefault(size = 20, sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable) {

		return ResponseEntity.ok(notificationService.getAllNotifications(pageable));
	}

	// Update the Notification Status

	@PatchMapping("/{id}/read")
	public ResponseEntity<NotificationResponse> markAsRead(@PathVariable Long id) {
		return ResponseEntity.ok(notificationService.markAsRead(id));
	}
}
