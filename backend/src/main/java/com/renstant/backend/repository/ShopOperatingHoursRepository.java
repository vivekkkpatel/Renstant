package com.renstant.backend.repository;

import com.renstant.backend.entity.ShopOperatingHours;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

public interface ShopOperatingHoursRepository
        extends JpaRepository<ShopOperatingHours, Long> {

    List<ShopOperatingHours> findByShopIdOrderByDayOfWeek(Long shopId);

    Optional<ShopOperatingHours>
    findByShopIdAndDayOfWeek(
            Long shopId,
            DayOfWeek dayOfWeek);
}