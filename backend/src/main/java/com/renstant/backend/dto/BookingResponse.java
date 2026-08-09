package com.renstant.backend.dto;

import com.renstant.backend.entity.BookingStatus;
import com.renstant.backend.entity.PickupType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class BookingResponse {

    private Long id;

    private Long vehicleId;
    private String vehicleName;

    private Long vehicleUnitId;

    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;

    private BigDecimal totalPrice;

    private BookingStatus status;
    private PickupType pickupType;

    private String deliveryAddress;
}