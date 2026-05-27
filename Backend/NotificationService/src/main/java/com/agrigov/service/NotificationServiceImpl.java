package com.agrigov.service;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.agrigov.client.FarmerClient;
import com.agrigov.dto.FarmerResponse;
import com.agrigov.dto.NotificationRequest;
import com.agrigov.dto.NotificationResponse;
import com.agrigov.enums.NotificationStatus;
import com.agrigov.model.Notification;
import com.agrigov.repository.NotificationRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private static final Logger logger =
            LoggerFactory.getLogger(NotificationServiceImpl.class);

    private final NotificationRepository notificationRepository;
    private final JavaMailSender mailSender;
    private final FarmerClient farmerClient;

    @Value("${app.notification.default-email:admin@agrigov.com}")
    private String defaultEmail;

    @Override
    @Transactional
    public NotificationResponse createNotification(NotificationRequest request) {

        if (request.getFarmerId() == null) {
            throw new IllegalArgumentException("Farmer ID must be provided");
        }

        // Check for farmer email if it's missing in the request
        
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            try {
                logger.info("Fetching email for farmerId={}", request.getFarmerId());

                FarmerResponse farmer =
                        farmerClient.getFarmerById(request.getFarmerId());

                if (farmer != null && farmer.getEmail() != null
                        && !farmer.getEmail().isBlank()) {
                    request.setEmail(farmer.getEmail());
                } else {
                    request.setEmail(defaultEmail);
                }

            } catch (Exception ex) {
                logger.error("FarmerService unavailable, using default email", ex);
                request.setEmail(defaultEmail);
            }
        }

        logger.info("Sending notification to email={}", request.getEmail());

        // Prepare and save the notification details to database
        
        Notification notification = new Notification();
        notification.setFarmerId(request.getFarmerId());
        notification.setEntityId(request.getEntityId());
        notification.setMessage(request.getMessage());
        notification.setCategory(request.getCategory());
        notification.setStatus(NotificationStatus.SENT);
        notification.setCreatedDate(LocalDateTime.now());

        Notification saved = notificationRepository.save(notification);

        // Send out the actual email to the recipient
        
        sendEmail(request.getEmail(), request.getMessage());

        return mapToResponse(saved);
    }

    // Standard helper to handle SMTP email sending
    private void sendEmail(String recipient, String message) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(recipient);
            mail.setSubject("AgriGov Notification");
            mail.setText(message);
            mailSender.send(mail);

            logger.info("Email sent successfully to {}", recipient);
        } catch (Exception e) {
            logger.error("Failed to send email to {}", recipient, e);
        }
    }

    @Override
    public Page<NotificationResponse> getFarmerNotifications(
            Long farmerId, Pageable pageable) {
        // Fetch paginated history for a specific farmer
        return notificationRepository
                .findByFarmerId(farmerId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional
    public NotificationResponse markAsRead(Long notificationId) {
        // Update notification status to read based on ID
        return notificationRepository.findById(notificationId)
                .map(n -> {
                    n.setStatus(NotificationStatus.READ);
                    return mapToResponse(notificationRepository.save(n));
                })
                .orElseThrow(() ->
                        new RuntimeException("Notification not found: " + notificationId));
    }

    @Override
    public Page<NotificationResponse> getAllNotifications(Pageable pageable) {
        // Retrieve all notifications across the system
        return notificationRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    // Convert entity object to DTO for response
    private NotificationResponse mapToResponse(Notification n) {
        NotificationResponse r = new NotificationResponse();
        r.setNotificationId(n.getNotificationId());
        r.setFarmerId(n.getFarmerId());
        r.setEntityId(n.getEntityId());
        r.setMessage(n.getMessage());
        r.setCategory(n.getCategory());
        r.setStatus(n.getStatus());
        r.setCreatedDate(n.getCreatedDate());
        return r;
    }
}