package com.renstant.backend.dto;

import com.renstant.backend.entity.VehicleType;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CreateVehicleRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String brand;

    private String model;

    @NotNull
    private VehicleType type;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal pricePerDay;

    @DecimalMin(value = "0.0")
    private BigDecimal securityDeposit;

    @Size(max = 1000)
    private String description;

    private String imageUrl;
}