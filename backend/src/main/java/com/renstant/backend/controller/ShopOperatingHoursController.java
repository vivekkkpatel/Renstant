package com.renstant.backend.controller;

import com.renstant.backend.dto.ShopOperatingHoursRequest;
import com.renstant.backend.dto.ShopOperatingHoursResponse;
import com.renstant.backend.entity.ShopOperatingHours;
import com.renstant.backend.entity.User;
import com.renstant.backend.service.ShopOperatingHoursService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shops/my-shop/operating-hours")
public class ShopOperatingHoursController {

    private final ShopOperatingHoursService operatingHoursService;

    public ShopOperatingHoursController(
            ShopOperatingHoursService operatingHoursService) {

        this.operatingHoursService = operatingHoursService;
    }

    @GetMapping
    public ResponseEntity<List<ShopOperatingHoursResponse>>
            getOperatingHours(
                    Authentication authentication) {

        User owner = (User) authentication.getPrincipal();

        List<ShopOperatingHoursResponse> response =
                operatingHoursService
                        .getMyOperatingHours(owner)
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<ShopOperatingHoursResponse>
            saveOperatingHours(
                    @Valid @RequestBody ShopOperatingHoursRequest request,
                    Authentication authentication) {

        User owner = (User) authentication.getPrincipal();

        ShopOperatingHours hours =
                operatingHoursService
                        .saveOperatingHours(request, owner);

        return ResponseEntity.ok(toResponse(hours));
    }

    private ShopOperatingHoursResponse toResponse(
            ShopOperatingHours hours) {

        return new ShopOperatingHoursResponse(
                hours.getId(),
                hours.getDayOfWeek(),
                hours.getOpeningTime(),
                hours.getClosingTime(),
                hours.getClosed());
    }
}