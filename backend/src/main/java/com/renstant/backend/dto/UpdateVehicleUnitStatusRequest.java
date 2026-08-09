package com.renstant.backend.dto;

import com.renstant.backend.entity.VehicleUnitStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateVehicleUnitStatusRequest {

    @NotNull
    private VehicleUnitStatus status;
}