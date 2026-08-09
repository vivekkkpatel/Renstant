package com.renstant.backend.dto;

import com.renstant.backend.entity.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class VehicleResponse {

    private Long id;

    private String name;
    private String brand;
    private String model;
    private VehicleType type;

    private BigDecimal pricePerDay;
    private BigDecimal securityDeposit;

    private String description;
    private String imageUrl;

    private Double rating;
    private Boolean active;

    private Long shopId;
    private String shopName;
}