package com.renstant.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class UpdateVehicleRequest {

    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal pricePerDay;

    @DecimalMin(value = "0.0")
    private BigDecimal securityDeposit;

    @Size(max = 1000)
    private String description;

    private String imageUrl;

    private Boolean active;
}