package com.renstant.backend.service;

import com.renstant.backend.entity.Vehicle;
import com.renstant.backend.entity.VehicleType;
import com.renstant.backend.repository.ShopRepository;
import com.renstant.backend.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import com.renstant.backend.dto.CreateVehicleRequest;
import com.renstant.backend.dto.UpdateVehicleRequest;
import com.renstant.backend.entity.Shop;
import com.renstant.backend.entity.User;
import com.renstant.backend.repository.ShopRepository;
import com.renstant.backend.exception.*;
import com.renstant.backend.dto.UpdateVehicleRequest;
import org.springframework.transaction.annotation.Transactional;

import com.renstant.backend.dto.NearbyVehicleResponse;
import java.util.Comparator;

import com.renstant.backend.dto.VehicleSearchResponse;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final ShopRepository shopRepository;
    private final VehicleUnitService vehicleUnitService;

    public List<VehicleSearchResponse> searchVehicles(
        String city,
        LocalDateTime start,
        LocalDateTime end,
        VehicleType type,
        BigDecimal minPrice,
        BigDecimal maxPrice) {

    if (city == null || city.isBlank()) {
        throw new IllegalArgumentException("City is required");
    }

    if (start == null || end == null || !start.isBefore(end)) {
        throw new IllegalArgumentException(
                "Start date/time must be before end date/time"
        );
    }

    if (start.isBefore(LocalDateTime.now())) {
        throw new IllegalArgumentException(
                "Search start date/time cannot be in the past"
        );
    }

    if (minPrice != null &&
            maxPrice != null &&
            minPrice.compareTo(maxPrice) > 0) {

        throw new IllegalArgumentException(
                "Minimum price cannot be greater than maximum price"
        );
    }

    List<Vehicle> candidates =
        vehicleRepository.searchActiveVehicles(
                city.trim(),
                type,
                minPrice,
                maxPrice
        );

return candidates.stream()
        .map(vehicle -> {

            int availableUnits =
                    vehicleUnitService
                            .getAvailableUnits(
                                    vehicle.getId(),
                                    start,
                                    end
                            )
                            .size();

            return new VehicleSearchResponse(
                    vehicle.getId(),
                    vehicle.getName(),
                    vehicle.getBrand(),
                    vehicle.getModel(),
                    vehicle.getType(),
                    vehicle.getPricePerDay(),
                    vehicle.getSecurityDeposit(),
                    vehicle.getImageUrl(),
                    vehicle.getRating(),
                    vehicle.getShop().getId(),
                    vehicle.getShop().getName(),
                    vehicle.getShop().getCity(),
                    availableUnits
            );
        })

        // Sold-out listings aren't shown
        .filter(vehicle ->
                vehicle.getAvailableUnits() > 0)

        .toList();

    // return vehicleRepository.findAll()
    //         .stream()

    //         // Listing must be active
    //         .filter(vehicle ->
    //                 Boolean.TRUE.equals(vehicle.getActive()))

    //         // Shop must also be active
    //         .filter(vehicle ->
    //                 Boolean.TRUE.equals(
    //                         vehicle.getShop().getActive()
    //                 ))

    //         // City
    //         .filter(vehicle ->
    //                 vehicle.getShop()
    //                         .getCity()
    //                         .equalsIgnoreCase(city.trim()))

    //         // Optional type
    //         .filter(vehicle ->
    //                 type == null ||
    //                 vehicle.getType() == type)

    //         // Optional minimum price
    //         .filter(vehicle ->
    //                 minPrice == null ||
    //                 vehicle.getPricePerDay()
    //                         .compareTo(minPrice) >= 0)

    //         // Optional maximum price
    //         .filter(vehicle ->
    //                 maxPrice == null ||
    //                 vehicle.getPricePerDay()
    //                         .compareTo(maxPrice) <= 0)

    //         .map(vehicle -> {

    //             int availableUnits =
    //                     vehicleUnitService
    //                             .getAvailableUnits(
    //                                     vehicle.getId(),
    //                                     start,
    //                                     end
    //                             )
    //                             .size();

    //             return new VehicleSearchResponse(
    //                     vehicle.getId(),
    //                     vehicle.getName(),
    //                     vehicle.getBrand(),
    //                     vehicle.getModel(),
    //                     vehicle.getType(),
    //                     vehicle.getPricePerDay(),
    //                     vehicle.getSecurityDeposit(),
    //                     vehicle.getImageUrl(),
    //                     vehicle.getRating(),

    //                     vehicle.getShop().getId(),
    //                     vehicle.getShop().getName(),
    //                     vehicle.getShop().getCity(),

    //                     availableUnits
    //             );
    //         })

    //         // Don't show sold-out listings
    //         .filter(vehicle ->
    //                 vehicle.getAvailableUnits() > 0)

    //         .toList();
}

    public VehicleService(
        VehicleRepository vehicleRepository,
        ShopRepository shopRepository,
        VehicleUnitService vehicleUnitService) {

    this.vehicleRepository = vehicleRepository;
    this.shopRepository = shopRepository;
    this.vehicleUnitService = vehicleUnitService;
}

    public Vehicle addVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle createVehicle(
        Long shopId,
        CreateVehicleRequest request,
        User partner) {

    Shop shop = shopRepository.findById(shopId)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Shop not found"));

    // Partner can only add vehicles to their own shop
    if (!shop.getOwner().getId().equals(partner.getId())) {
        throw new ForbiddenException(
                "You are not allowed to manage this shop"
        );
    }

    Vehicle vehicle = new Vehicle();

    vehicle.setName(request.getName());
    vehicle.setBrand(request.getBrand());
    vehicle.setModel(request.getModel());
    vehicle.setType(request.getType());

    vehicle.setPricePerDay(request.getPricePerDay());
    vehicle.setSecurityDeposit(request.getSecurityDeposit());

    vehicle.setDescription(request.getDescription());
    vehicle.setImageUrl(request.getImageUrl());

    vehicle.setRating(0.0);
    vehicle.setActive(true);

    vehicle.setShop(shop);

    return vehicleRepository.save(vehicle);
}

public Vehicle getVehicleById(Long id) {
    return vehicleRepository.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Vehicle not found"));
}

public List<Vehicle> getPartnerVehicles(User partner) {

    return vehicleRepository
            .findByShopOwnerIdOrderByIdDesc(partner.getId());
}

public Vehicle getPartnerVehicle(
        Long vehicleId,
        User partner) {

    Vehicle vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Vehicle not found"));

    if (!vehicle.getShop()
            .getOwner()
            .getId()
            .equals(partner.getId())) {

        throw new ForbiddenException(
                "You are not allowed to manage this vehicle"
        );
    }

    return vehicle;
}

@Transactional
public Vehicle updatePartnerVehicle(
        Long vehicleId,
        UpdateVehicleRequest request,
        User partner) {

    Vehicle vehicle = getPartnerVehicle(vehicleId, partner);

    if (request.getPricePerDay() != null) {
        vehicle.setPricePerDay(request.getPricePerDay());
    }

    if (request.getSecurityDeposit() != null) {
        vehicle.setSecurityDeposit(request.getSecurityDeposit());
    }

    if (request.getDescription() != null) {
        vehicle.setDescription(request.getDescription());
    }

    if (request.getImageUrl() != null) {
        vehicle.setImageUrl(request.getImageUrl());
    }

    if (request.getActive() != null) {
        vehicle.setActive(request.getActive());
    }

    return vehicleRepository.save(vehicle);
}

public List<NearbyVehicleResponse> searchNearbyVehicles(
        double latitude,
        double longitude,
        double radiusKm,
        LocalDateTime start,
        LocalDateTime end,
        VehicleType type,
        BigDecimal minPrice,
        BigDecimal maxPrice) {

    if (minPrice != null &&
        maxPrice != null &&
        minPrice.compareTo(maxPrice) > 0) {

    throw new IllegalArgumentException(
            "Minimum price cannot be greater than maximum price"
    );
}

    if (latitude < -90 || latitude > 90) {
        throw new IllegalArgumentException("Invalid latitude");
    }

    if (longitude < -180 || longitude > 180) {
        throw new IllegalArgumentException("Invalid longitude");
    }

    if (radiusKm <= 0 || radiusKm > 100) {
        throw new IllegalArgumentException(
                "Radius must be between 0 and 100 km"
        );
    }

    if (start == null || end == null || !start.isBefore(end)) {
        throw new IllegalArgumentException(
                "Start date/time must be before end date/time"
        );
    }

    if (start.isBefore(LocalDateTime.now())) {
        throw new IllegalArgumentException(
                "Search start date/time cannot be in the past"
        );
    }

    /*
     * Rough conversion:
     * 1 degree latitude ≈ 111 km.
     *
     * Longitude distance changes depending on latitude,
     * hence the cosine calculation.
     */
    double latDelta = radiusKm / 111.0;

    double cosLatitude =
            Math.cos(Math.toRadians(latitude));

    double lonDelta =
            radiusKm / (111.0 * cosLatitude);

    double minLat = latitude - latDelta;
    double maxLat = latitude + latDelta;

    double minLon = longitude - lonDelta;
    double maxLon = longitude + lonDelta;

    List<Vehicle> candidates =
            vehicleRepository.findActiveVehiclesWithinBounds(
        minLat,
        maxLat,
        minLon,
        maxLon,
        type,
        minPrice,
        maxPrice
);

    return candidates.stream()
            .map(vehicle -> {

                double distance =
                        calculateDistanceKm(
                                latitude,
                                longitude,
                                vehicle.getShop().getLatitude(),
                                vehicle.getShop().getLongitude()
                        );

                int availableUnits =
                        vehicleUnitService
                                .getAvailableUnits(
                                        vehicle.getId(),
                                        start,
                                        end
                                )
                                .size();

                return new NearbyVehicleResponse(
                        vehicle.getId(),
                        vehicle.getName(),
                        vehicle.getBrand(),
                        vehicle.getModel(),
                        vehicle.getType(),
                        vehicle.getPricePerDay(),
                        vehicle.getSecurityDeposit(),
                        vehicle.getImageUrl(),
                        vehicle.getRating(),
                        vehicle.getShop().getId(),
                        vehicle.getShop().getName(),
                        vehicle.getShop().getCity(),
                        availableUnits,
                        Math.round(distance * 100.0) / 100.0
                );
            })

            // Bounding box is rectangular.
            // Haversine gives the actual circular radius.
            .filter(vehicle ->
                    vehicle.getDistanceKm() <= radiusKm)

            // Don't show sold-out vehicles
            .filter(vehicle ->
                    vehicle.getAvailableUnits() > 0)

            // Nearest first
            .sorted(
                    Comparator.comparingDouble(
                            NearbyVehicleResponse::getDistanceKm
                    )
            )

            .toList();
}

private double calculateDistanceKm(
        double lat1,
        double lon1,
        double lat2,
        double lon2) {

    final double EARTH_RADIUS_KM = 6371.0;

    double latDistance =
            Math.toRadians(lat2 - lat1);

    double lonDistance =
            Math.toRadians(lon2 - lon1);

    double a =
            Math.sin(latDistance / 2)
                    * Math.sin(latDistance / 2)

            + Math.cos(Math.toRadians(lat1))
                    * Math.cos(Math.toRadians(lat2))

            * Math.sin(lonDistance / 2)
                    * Math.sin(lonDistance / 2);

    double c =
            2 * Math.atan2(
                    Math.sqrt(a),
                    Math.sqrt(1 - a)
            );

    return EARTH_RADIUS_KM * c;
}

}
