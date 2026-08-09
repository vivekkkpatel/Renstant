package com.renstant.backend.dto;

import com.renstant.backend.entity.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class NearbyVehicleResponse {

    private Long vehicleId;

    private String name;
    private String brand;
    private String model;
    private VehicleType type;

    private BigDecimal pricePerDay;
    private BigDecimal securityDeposit;

    private String imageUrl;
    private Double rating;

    private Long shopId;
    private String shopName;
    private String city;

    private int availableUnits;

    private double distanceKm;
}