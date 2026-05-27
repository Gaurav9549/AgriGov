package com.agrigov.dto;
 
import com.agrigov.enums.Status;
 
import lombok.Data;
@Data
public class UpdateStatusRequest {
	private Status status;
}