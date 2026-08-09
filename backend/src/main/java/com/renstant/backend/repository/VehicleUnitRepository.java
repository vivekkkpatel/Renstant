package com.renstant.backend.repository;

import com.renstant.backend.entity.VehicleUnit;
import com.renstant.backend.entity.VehicleUnitStatus;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VehicleUnitRepository
        extends JpaRepository<VehicleUnit, Long> {

    List<VehicleUnit> findByVehicleId(Long vehicleId);

    boolean existsByRegistrationNumber(String registrationNumber);

    List<VehicleUnit> findByVehicleIdAndStatus(
        Long vehicleId,
        VehicleUnitStatus status
);

@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("""
    SELECT vu
    FROM VehicleUnit vu
    WHERE vu.vehicle.id = :vehicleId
      AND vu.status = :status
    ORDER BY vu.id
    """)
List<VehicleUnit> findByVehicleIdAndStatusForUpdate(
        @Param("vehicleId") Long vehicleId,
        @Param("status") VehicleUnitStatus status
);
}