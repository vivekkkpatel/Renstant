package com.renstant.backend.repository;
import java.util.List;
import com.renstant.backend.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import com.renstant.backend.entity.VehicleType;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

import com.renstant.backend.entity.VehicleType;
import java.math.BigDecimal;


public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    List<Vehicle> findByShopId(Long shopId);

    List<Vehicle> findByShopOwnerIdOrderByIdDesc(Long ownerId);

    @Query("""
    SELECT v
    FROM Vehicle v
    JOIN v.shop s
    WHERE v.active = true
      AND s.active = true
      AND LOWER(s.city) = LOWER(:city)
      AND (:type IS NULL OR v.type = :type)
      AND (:minPrice IS NULL OR v.pricePerDay >= :minPrice)
      AND (:maxPrice IS NULL OR v.pricePerDay <= :maxPrice)
    ORDER BY v.rating DESC, v.id DESC
    """)
List<Vehicle> searchActiveVehicles(
        @Param("city") String city,
        @Param("type") VehicleType type,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice
);

@Query("""
    SELECT v
    FROM Vehicle v
    JOIN v.shop s
    WHERE v.active = true
      AND s.active = true
      AND s.latitude IS NOT NULL
      AND s.longitude IS NOT NULL
      AND s.latitude BETWEEN :minLat AND :maxLat
      AND s.longitude BETWEEN :minLon AND :maxLon
      AND (:type IS NULL OR v.type = :type)
      AND (:minPrice IS NULL OR v.pricePerDay >= :minPrice)
      AND (:maxPrice IS NULL OR v.pricePerDay <= :maxPrice)
    """)
List<Vehicle> findActiveVehiclesWithinBounds(
        @Param("minLat") Double minLat,
        @Param("maxLat") Double maxLat,
        @Param("minLon") Double minLon,
        @Param("maxLon") Double maxLon,
        @Param("type") VehicleType type,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice
);


}