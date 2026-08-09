package com.renstant.backend.dto;

import com.renstant.backend.entity.VehicleUnitStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class VehicleUnitResponse {

    private Long id;
    private String registrationNumber;
    private VehicleUnitStatus status;

    private Long vehicleId;
    private String vehicleName;
}