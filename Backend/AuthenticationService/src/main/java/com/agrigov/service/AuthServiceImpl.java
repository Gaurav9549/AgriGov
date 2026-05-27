package com.agrigov.service;
 
import java.time.Instant;
import java.util.List;
 
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
 
import com.agrigov.dto.AuthRequest;
import com.agrigov.dto.AuthResponse;
import com.agrigov.dto.ForgotPasswordRequest;
import com.agrigov.dto.RefreshTokenRequest;
import com.agrigov.dto.RegisterRequest;
import com.agrigov.dto.UserDTO;
import com.agrigov.dto.UserRequest;
import com.agrigov.dto.UserResponse;
import com.agrigov.dto.UserSubsidyDTO;
import com.agrigov.enums.Status;
import com.agrigov.exception.AccountInactiveException;
import com.agrigov.exception.AccountSuspendedException;
import com.agrigov.exception.InvalidCredentialsException;
import com.agrigov.exception.InvalidRefreshTokenException;
import com.agrigov.exception.UserAlreadyExistsException;
import com.agrigov.model.AuditLog;
import com.agrigov.model.RefreshToken;
import com.agrigov.model.User;
import com.agrigov.repository.RefreshTokenRepository;
import com.agrigov.repository.UserRepository;
 
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
 
@Service
@Transactional
@Slf4j
public class AuthServiceImpl implements AuthService {
 
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuditLogService auditLogService;
 
    public AuthServiceImpl(
            UserRepository userRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuditLogService auditLogService) {
 
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.auditLogService = auditLogService;
    }
 
    // =======================
    // AUTHENTICATION FLOWS
    // =======================
 
    @Override
    public AuthResponse login(AuthRequest request) {
 
        User user = userRepository
                .findByEmailIgnoreCase(request.getUsernameOrEmail())
                .orElseThrow(InvalidCredentialsException::new);
 
        if (user.getStatus() == Status.SUSPENDED) {
            audit("LOGIN_BLOCKED_SUSPENDED", request.getUsernameOrEmail(), null,
                    "Account suspended");
            throw new AccountSuspendedException();
        }
 
        if (user.getStatus() != Status.ACTIVE) {
            throw new AccountInactiveException();
        }
 
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            audit("LOGIN_FAILED", request.getUsernameOrEmail(), null,
                    "Invalid password");
            throw new InvalidCredentialsException();
        }
 
        user.setLastLoginAt(Instant.now());
 
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
 
        refreshTokenRepository.save(new RefreshToken(refreshToken, user));
 
        audit("LOGIN_SUCCESS", user.getEmail(), null, "User logged in");
 
        AuthResponse response = new AuthResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setId(user.getId());
        response.setExpiresIn(jwtService.getAccessTokenTtlSeconds());
 
        return response;
    }
 
    @Override
    public AuthResponse refresh(RefreshTokenRequest request) {
 
        RefreshToken stored = refreshTokenRepository
                .findByToken(request.getRefreshToken())
                .orElseThrow(InvalidRefreshTokenException::new);
 
        User user = stored.getUser();
        refreshTokenRepository.delete(stored);
 
        String newAccess = jwtService.generateAccessToken(user);
        String newRefresh = jwtService.generateRefreshToken(user);
 
        refreshTokenRepository.save(new RefreshToken(newRefresh, user));
 
        audit("TOKEN_REFRESHED", user.getEmail(), null, "Access token refreshed");
 
        AuthResponse response = new AuthResponse();
        response.setAccessToken(newAccess);
        response.setRefreshToken(newRefresh);
        response.setExpiresIn(jwtService.getAccessTokenTtlSeconds());
 
        return response;
    }
 
    @Override
    public void logout(String refreshToken) {
        refreshTokenRepository.deleteByToken(refreshToken);
        audit("LOGOUT", SecurityUtil.getCurrentUserEmail(), null, "User logged out");
    }
 
    @Override
    public UserResponse register(RegisterRequest request) {
        if (userRepository.findByEmailIgnoreCase(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException();
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(request.getRole());
        user.setStatus(Status.ACTIVE);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        User savedUser = userRepository.save(user);
        audit("USER_REGISTERED",
              savedUser.getEmail(),
              savedUser.getId().toString(),
              "New user registered");
        return map(savedUser);
    }
 
    // =======================
    // USER MANAGEMENT
    // =======================
 
    @Override
    public void changePassword(String newPassword) {
 
        User user = getCurrentUser();
 
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        refreshTokenRepository.deleteAllByUser(user);
 
        audit("PASSWORD_CHANGED", user.getEmail(), null, "Password updated");
    }
 
    @Override
    public UserResponse getUserById(Long id) {
 
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
 
        audit("USER_FETCHED", SecurityUtil.getCurrentUserEmail(),
                id.toString(), "Fetched user by ID");
 
        return map(user);
    }
 
    @Override
    public List<UserResponse> getAllUsers() {
 
        audit("USER_LISTED", SecurityUtil.getCurrentUserEmail(),
                null, "Fetched all users");
 
        return userRepository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }
 
    @Override
    public UserResponse updateUser(Long id, UserRequest request) {
 
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
 
        user.setName(request.getName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(request.getRole());
 
        audit("USER_UPDATED", SecurityUtil.getCurrentUserEmail(),
                id.toString(), "User updated");
 
        return map(user);
    }
 
    @Override
    public void deleteUser(Long id) {
 
        userRepository.deleteById(id);
 
        audit("USER_DELETED", SecurityUtil.getCurrentUserEmail(),
                id.toString(), "User deleted");
    }
// Add these implementations inside your AuthServiceImpl class
    @Override
    public void updateStatus(Long id, Status status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Status oldStatus = user.getStatus();
        user.setStatus(status);
        userRepository.save(user);
 
        // Audit the admin action
        audit("USER_STATUS_UPDATED", SecurityUtil.getCurrentUserEmail(), id.toString(), 
              "Changed from " + oldStatus + " to " + status);
        log.info("Admin {} updated status for user {} to {}", SecurityUtil.getCurrentUserEmail(), id, status);
    }
 
    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByNameAndRoleAndEmailAndPhoneNumber(
                request.getName(), 
                request.getRole(), 
                request.getEmail(), 
                request.getPhoneNumber()
        ).orElseThrow(() -> new InvalidCredentialsException()); // Use existing exception or custom one
 
        // Update with encoded password
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
 
        // Invalidate sessions for security
        refreshTokenRepository.deleteAllByUser(user);
 
        audit("FORGOT_PASSWORD_RESET", request.getEmail(), user.getId().toString(), "Password reset via multi-field verification");
        log.info("Password reset successful for user: {}", request.getEmail());
    }
    // =======================
    // HELPER METHODS
    // =======================
 
    private User getCurrentUser() {
        String email = SecurityUtil.getCurrentUserEmail();
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Override
    public UserDTO getCurrentUserId() {
 
        String email = SecurityUtil.getCurrentUserEmail();
 
        if (email == null) {
            throw new RuntimeException("Unauthenticated request");
        }
 
        User user = userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
 
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        return dto;
    }
    @Override
    public UserSubsidyDTO getCurrentUserRoleId() {
    	Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // extracted from JWT
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserSubsidyDTO dto = new UserSubsidyDTO();
        dto.setId(user.getId());
        dto.setRole(user.getRole());
        return dto;
    }
    private UserResponse map(User user) {
        UserResponse r = new UserResponse();
        r.setId(user.getId());
        r.setName(user.getName());
        r.setEmail(user.getEmail());
        r.setPhoneNumber(user.getPhoneNumber());
        r.setRole(user.getRole());
        r.setStatus(user.getStatus());
        r.setLastLoginAt(user.getLastLoginAt());
        return r;
    }
 
    private void audit(String event, String actor, String target, String metadata) {
 
        AuditLog log = new AuditLog();
        log.setEvent(event);
        log.setActor(actor);
        log.setTarget(target);
        log.setMetadata(metadata);
 
        auditLogService.write(log);
    }
}