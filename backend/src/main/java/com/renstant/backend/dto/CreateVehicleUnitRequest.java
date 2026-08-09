package com.renstant.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateVehicleUnitRequest {

    @NotBlank
    private String registrationNumber;
}