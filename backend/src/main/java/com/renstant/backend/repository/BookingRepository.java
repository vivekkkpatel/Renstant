package com.renstant.backend.repository;

import com.renstant.backend.entity.Booking;
import com.renstant.backend.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<Booking> findByVehicleShopOwnerIdOrderByCreatedAtDesc(Long ownerId);

    @Query("""
        SELECT b.vehicleUnit.id
        FROM Booking b
        WHERE b.vehicle.id = :vehicleId
          AND b.vehicleUnit IS NOT NULL
          AND b.status IN :blockingStatuses
          AND b.startDateTime < :requestedEnd
          AND b.endDateTime > :requestedStart
        """)
    List<Long> findUnavailableUnitIds(
            @Param("vehicleId") Long vehicleId,
            @Param("requestedStart") LocalDateTime requestedStart,
            @Param("requestedEnd") LocalDateTime requestedEnd,
            @Param("blockingStatuses") List<BookingStatus> blockingStatuses
    );
}