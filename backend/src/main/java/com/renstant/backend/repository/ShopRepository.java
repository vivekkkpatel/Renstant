package com.renstant.backend.repository;

import com.renstant.backend.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;

import com.renstant.backend.entity.ShopOperatingHours;

import java.util.List;
import java.util.Optional;

import java.time.DayOfWeek;

public interface ShopRepository extends JpaRepository<Shop, Long> {

    List<Shop> findByCityIgnoreCase(String city);

    Optional<Shop> findByOwnerId(Long ownerId);

    public interface ShopOperatingHoursRepository
        extends JpaRepository<ShopOperatingHours, Long> {

    List<ShopOperatingHours> findByShopIdOrderByDayOfWeek(Long shopId);

    Optional<ShopOperatingHours> findByShopIdAndDayOfWeek(
            Long shopId,
            DayOfWeek dayOfWeek);
}
}