package com.agrigov.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.agrigov.enums.Role;
import com.agrigov.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailIgnoreCase(String email);
    
 // query for password recovery verification
    Optional<User> findByNameAndRoleAndEmailAndPhoneNumber(
        String name, Role role, String email, String phoneNumber);
}
