package com.renstant.backend.repository;

import com.renstant.backend.entity.ShopClosure;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ShopClosureRepository
        extends JpaRepository<ShopClosure, Long> {

    List<ShopClosure> findByShopIdOrderByStartDate(Long shopId);

    boolean existsByShopIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Long shopId,
            LocalDate endDate,
            LocalDate startDate
    );
}