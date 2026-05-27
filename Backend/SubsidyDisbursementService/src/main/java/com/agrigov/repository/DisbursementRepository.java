package com.agrigov.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.agrigov.model.Disbursement;
import com.agrigov.model.Subsidy;

public interface DisbursementRepository
        extends JpaRepository<Disbursement, Long> {

    // ✅ OPTION 2: ENTITY-BASED CHECK (RECOMMENDED)
    boolean existsBySubsidy(Subsidy subsidy);
}
