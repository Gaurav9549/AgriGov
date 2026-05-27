package com.agrigov.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.agrigov.dto.NotificationRequest;
import com.agrigov.dto.NotificationResponse;

public interface NotificationService {

    NotificationResponse createNotification(NotificationRequest request);

    Page<NotificationResponse> getFarmerNotifications(Long farmerId, Pageable pageable);

    NotificationResponse markAsRead(Long notificationId);

    Page<NotificationResponse> getAllNotifications(Pageable pageable);
}