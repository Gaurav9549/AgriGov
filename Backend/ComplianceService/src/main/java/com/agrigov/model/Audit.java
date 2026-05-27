package com.agrigov.model;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Audit")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Audit {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "audit_id", nullable = false)
	private Long auditId;
	
	private Long userId;

	@Column(name = "Scope", nullable = false, length = 50)
	@NotBlank(message = "Scope Type is required")
	private String scope;
	
	@Column(name = "Findings", nullable = false, length = 50)
	@NotBlank(message = "Findings Result is required")
	private String findings;
	
	@Column(name = "Date", updatable = false)
    private LocalDate date;
    @PrePersist
    public void prePersist() {
        this.date = LocalDate.now();
    }
	
	@Column(name = "Status", nullable = false, length = 50)
	@NotBlank(message = "Audit Status is required")
	private String status;
	
}
