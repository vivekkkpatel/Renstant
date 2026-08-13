package com.renstant.backend.controller;

import com.renstant.backend.dto.CreateVehicleRequest;
import com.renstant.backend.dto.VehicleResponse;
import com.renstant.backend.dto.VehicleSearchResponse;
import com.renstant.backend.entity.User;
import com.renstant.backend.entity.Vehicle;
import com.renstant.backend.entity.VehicleType;
import com.renstant.backend.service.VehicleService;
import com.renstant.backend.service.VehicleUnitService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.renstant.backend.dto.AvailabilityResponse;
import com.renstant.backend.entity.VehicleUnit;

import java.math.BigDecimal;
import java.time.LocalDateTime;


import java.util.List;

import com.renstant.backend.dto.NearbyVehicleResponse;

@RestController
@RequestMapping("/api")
public class VehicleController {

    private final VehicleUnitService vehicleUnitService;

    private final VehicleService vehicleService;

    public VehicleController(
        VehicleService vehicleService,
        VehicleUnitService vehicleUnitService) {

    this.vehicleService = vehicleService;
    this.vehicleUnitService = vehicleUnitService;
}

    // Public - browse all vehicles
    @GetMapping("/vehicles")
    public List<Vehicle> getAllVehicles() {
        return vehicleService.getAllVehicles();
    }

    @GetMapping("/vehicles/featured")
public ResponseEntity<List<VehicleResponse>> getFeaturedVehicles() {

    List<VehicleResponse> vehicles =
            vehicleService.getFeaturedVehicles()
                    .stream()
                    .map(this::toResponse)
                    .toList();

    return ResponseEntity.ok(vehicles);
}

    // Public - get vehicle details
@GetMapping("/vehicles/{vehicleId}")
public ResponseEntity<VehicleResponse> getVehicleById(
        @PathVariable Long vehicleId) {

    Vehicle vehicle = vehicleService.getVehicleById(vehicleId);

    return ResponseEntity.ok(toResponse(vehicle));
}

    // Partner - add vehicle listing to own shop
    @PostMapping("/shops/{shopId}/vehicles")
    public ResponseEntity<VehicleResponse> createVehicle(
            @PathVariable Long shopId,
            @Valid @RequestBody CreateVehicleRequest request,
            Authentication authentication) {

        User partner = (User) authentication.getPrincipal();

        Vehicle vehicle =
                vehicleService.createVehicle(shopId, request, partner);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toResponse(vehicle));
    }

    private VehicleResponse toResponse(Vehicle vehicle) {

        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getName(),
                vehicle.getBrand(),
                vehicle.getModel(),
                vehicle.getType(),
                vehicle.getPricePerDay(),
                vehicle.getSecurityDeposit(),
                vehicle.getDescription(),
                vehicle.getImageUrl(),
                vehicle.getRating(),
                vehicle.getActive(),
                vehicle.getShop().getId(),
                vehicle.getShop().getName()
        );
    }

    @GetMapping("/vehicles/{vehicleId}/availability")
public ResponseEntity<AvailabilityResponse> checkAvailability(
        @PathVariable Long vehicleId,
        @RequestParam LocalDateTime start,
        @RequestParam LocalDateTime end) {

    Vehicle vehicle = vehicleService.getVehicleById(vehicleId);

    List<VehicleUnit> available =
            vehicleUnitService.getAvailableUnits(
                    vehicleId,
                    start,
                    end
            );

    int totalUnits =
            vehicleUnitService.getTotalOperationalUnits(vehicleId);

    return ResponseEntity.ok(
            new AvailabilityResponse(
                    vehicle.getId(),
                    vehicle.getName(),
                    totalUnits,
                    available.size()
            )
    );
}


@GetMapping("/vehicles/search")
public ResponseEntity<List<VehicleSearchResponse>> searchVehicles(
        @RequestParam String city,
        @RequestParam LocalDateTime start,
        @RequestParam LocalDateTime end,
        @RequestParam(required = false) VehicleType type,
        @RequestParam(required = false) BigDecimal minPrice,
        @RequestParam(required = false) BigDecimal maxPrice) {

    return ResponseEntity.ok(
            vehicleService.searchVehicles(
                    city,
                    start,
                    end,
                    type,
                    minPrice,
                    maxPrice
            )
    );
}

@GetMapping("/vehicles/search/nearby")
public ResponseEntity<List<NearbyVehicleResponse>>
searchNearbyVehicles(

        @RequestParam double latitude,
        @RequestParam double longitude,

        @RequestParam(defaultValue = "10")
        double radiusKm,

        @RequestParam LocalDateTime start,
        @RequestParam LocalDateTime end,

        @RequestParam(required = false)
        VehicleType type,

        @RequestParam(required = false)
        BigDecimal minPrice,

        @RequestParam(required = false)
        BigDecimal maxPrice) {

    return ResponseEntity.ok(
            vehicleService.searchNearbyVehicles(
                    latitude,
                    longitude,
                    radiusKm,
                    start,
                    end,
                    type,
                    minPrice,
                    maxPrice
            )
    );
}




}