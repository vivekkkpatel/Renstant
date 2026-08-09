package com.renstant.backend.dto;

import com.renstant.backend.entity.PickupType;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CreateBookingRequest {

    @NotNull
    private Long vehicleId;

    @NotNull
    private LocalDateTime startDateTime;

    @NotNull
    private LocalDateTime endDateTime;

    @NotNull
    private PickupType pickupType;

    private String deliveryAddress;
}