package com.renstant.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AvailabilityResponse {

    private Long vehicleId;
    private String vehicleName;
    private int totalUnits;
    private int operationalUnits;
}