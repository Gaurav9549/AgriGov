package com.agrigov.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.agrigov.model.Farmer;
import com.agrigov.model.FarmerStatus;

public interface FarmerRepository extends JpaRepository<Farmer, Long> {

	// Using DSL Syntax
	// Find farmers by status
	List<Farmer> findByStatus(FarmerStatus status);

	// Find farmers by name
	List<Farmer> findByName(String name);

	// Find farmers by gender
	List<Farmer> findByGender(String gender);
}