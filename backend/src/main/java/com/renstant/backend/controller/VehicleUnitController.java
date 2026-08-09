package com.renstant.backend.controller;

import com.renstant.backend.dto.CreateVehicleUnitRequest;
import com.renstant.backend.dto.VehicleUnitResponse;
import com.renstant.backend.entity.User;
import com.renstant.backend.entity.VehicleUnit;
import com.renstant.backend.service.VehicleUnitService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class VehicleUnitController {

    private final VehicleUnitService vehicleUnitService;

    public VehicleUnitController(VehicleUnitService vehicleUnitService) {
        this.vehicleUnitService = vehicleUnitService;
    }

    @PostMapping("/vehicles/{vehicleId}/units")
    public ResponseEntity<VehicleUnitResponse> createUnit(
            @PathVariable Long vehicleId,
            @Valid @RequestBody CreateVehicleUnitRequest request,
            Authentication authentication) {

        User partner = (User) authentication.getPrincipal();

        VehicleUnit unit =
                vehicleUnitService.createUnit(vehicleId, request, partner);

        VehicleUnitResponse response = new VehicleUnitResponse(
                unit.getId(),
                unit.getRegistrationNumber(),
                unit.getStatus(),
                unit.getVehicle().getId(),
                unit.getVehicle().getName()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}