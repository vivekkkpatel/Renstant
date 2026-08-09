package com.renstant.backend.controller;

import java.util.*;

import com.renstant.backend.dto.CreateShopRequest;
import com.renstant.backend.dto.ShopResponse;
import com.renstant.backend.entity.Shop;
import com.renstant.backend.entity.User;
import com.renstant.backend.service.ShopService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shops")
public class ShopController {

    private final ShopService shopService;

    public ShopController(ShopService shopService) {
        this.shopService = shopService;
    }

    @PostMapping
    public ResponseEntity<ShopResponse> createShop(
            @Valid @RequestBody CreateShopRequest request,
            Authentication authentication) {

        User owner = (User) authentication.getPrincipal();

        Shop shop = shopService.createShop(request, owner);

        ShopResponse response = new ShopResponse(
                shop.getId(),
                shop.getName(),
                shop.getDescription(),
                shop.getPhone(),
                shop.getAddressLine(),
                shop.getCity(),
                shop.getState(),
                shop.getPincode(),
                shop.getLatitude(),
                shop.getLongitude(),
                shop.getRating(),
                shop.getActive(),
                shop.getTemporarilyClosed(),
                shop.getOwner().getId(),
                shop.getOwner().getName());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    private ShopResponse toResponse(Shop shop) {

        return new ShopResponse(
                shop.getId(),
                shop.getName(),
                shop.getDescription(),
                shop.getPhone(),
                shop.getAddressLine(),
                shop.getCity(),
                shop.getState(),
                shop.getPincode(),
                shop.getLatitude(),
                shop.getLongitude(),
                shop.getRating(),
                shop.getActive(),
                shop.getTemporarilyClosed(),
                shop.getOwner().getId(),
                shop.getOwner().getName());
    }

    @GetMapping
    public ResponseEntity<List<ShopResponse>> getAllShops(
            @RequestParam(required = false) String city) {

        List<ShopResponse> shops = shopService
                .getAllShops(city)
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(shops);
    }

    @GetMapping("/my-shop")
public ResponseEntity<ShopResponse> getMyShop(
        Authentication authentication) {

    User owner = (User) authentication.getPrincipal();

    Shop shop = shopService.getMyShop(owner);

    return ResponseEntity.ok(toResponse(shop));
}

    @GetMapping("/{id}")
    public ResponseEntity<ShopResponse> getShopById(
            @PathVariable Long id) {

        Shop shop = shopService.getShopById(id);

        return ResponseEntity.ok(toResponse(shop));
    }

    
}