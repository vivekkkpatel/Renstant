package com.renstant.backend.controller;

import com.renstant.backend.dto.VehicleResponse;
import com.renstant.backend.dto.VehicleUnitResponse;
import com.renstant.backend.entity.User;
import com.renstant.backend.entity.Vehicle;
import com.renstant.backend.entity.VehicleUnit;
import com.renstant.backend.service.VehicleService;
import com.renstant.backend.service.VehicleUnitService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.renstant.backend.dto.UpdateVehicleUnitStatusRequest;
import jakarta.validation.Valid;

import com.renstant.backend.dto.UpdateVehicleRequest;

import java.util.List;

@RestController
@RequestMapping("/api/partner")
public class PartnerFleetController {

    private final VehicleService vehicleService;
    private final VehicleUnitService vehicleUnitService;

    public PartnerFleetController(
            VehicleService vehicleService,
            VehicleUnitService vehicleUnitService) {

        this.vehicleService = vehicleService;
        this.vehicleUnitService = vehicleUnitService;
    }

    @GetMapping("/vehicles")
    public ResponseEntity<List<VehicleResponse>> getVehicles(
            Authentication authentication) {

        User partner = (User) authentication.getPrincipal();

        List<VehicleResponse> vehicles =
                vehicleService.getPartnerVehicles(partner)
                        .stream()
                        .map(this::toVehicleResponse)
                        .toList();

        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/vehicles/{vehicleId}/units")
    public ResponseEntity<List<VehicleUnitResponse>> getVehicleUnits(
            @PathVariable Long vehicleId,
            Authentication authentication) {

        User partner = (User) authentication.getPrincipal();

        List<VehicleUnitResponse> units =
                vehicleUnitService
                        .getPartnerVehicleUnits(vehicleId, partner)
                        .stream()
                        .map(this::toUnitResponse)
                        .toList();

        return ResponseEntity.ok(units);
    }

    private VehicleResponse toVehicleResponse(Vehicle vehicle) {

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

    private VehicleUnitResponse toUnitResponse(VehicleUnit unit) {

        return new VehicleUnitResponse(
                unit.getId(),
                unit.getRegistrationNumber(),
                unit.getStatus(),
                unit.getVehicle().getId(),
                unit.getVehicle().getName()
        );
    }

    @PatchMapping("/units/{unitId}/status")
public ResponseEntity<VehicleUnitResponse> updateUnitStatus(
        @PathVariable Long unitId,
        @Valid @RequestBody UpdateVehicleUnitStatusRequest request,
        Authentication authentication) {

    User partner = (User) authentication.getPrincipal();

    VehicleUnit unit =
            vehicleUnitService.updateUnitStatus(
                    unitId,
                    request.getStatus(),
                    partner
            );

    return ResponseEntity.ok(toUnitResponse(unit));
}

@PatchMapping("/vehicles/{vehicleId}")
public ResponseEntity<VehicleResponse> updateVehicle(
        @PathVariable Long vehicleId,
        @Valid @RequestBody UpdateVehicleRequest request,
        Authentication authentication) {

    User partner = (User) authentication.getPrincipal();

    Vehicle vehicle =
            vehicleService.updatePartnerVehicle(
                    vehicleId,
                    request,
                    partner
            );

    return ResponseEntity.ok(
            toVehicleResponse(vehicle)
    );
}
}