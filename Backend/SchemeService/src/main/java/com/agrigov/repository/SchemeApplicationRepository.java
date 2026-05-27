package com.agrigov.repository;

import com.agrigov.model.PolicyScheme;
import com.agrigov.model.SchemeApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SchemeApplicationRepository extends JpaRepository<SchemeApplication, Long> {

	// Single application (unique)
	Optional<SchemeApplication> findByApplicationID(Long applicationID);

	// MULTIPLE applications for one scheme
	List<SchemeApplication> findByPolicyscheme_SchemeID(Long schemeID);

	// Find specific application by farmer and scheme (useful for checking
	// duplicates)
	Optional<SchemeApplication> findByPolicyscheme_SchemeIDAndFarmerID(Long schemeID, Long farmerID);

	// Fetch ALL applications for a specific farmer

	List<SchemeApplication> findByFarmerID(Long farmerID);
}