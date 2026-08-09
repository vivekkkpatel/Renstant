package com.renstant.backend.repository;

import com.renstant.backend.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShopRepository extends JpaRepository<Shop, Long> {

    List<Shop> findByCityIgnoreCase(String city);

    Optional<Shop> findByOwnerId(Long ownerId);
}