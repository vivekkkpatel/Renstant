package com.renstant.backend.repository;

import com.renstant.backend.entity.Booking;
import com.renstant.backend.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;

import jakarta.persistence.LockModeType;

import java.time.LocalDateTime;
import java.util.List;

import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<Booking> findByVehicleShopOwnerIdOrderByCreatedAtDesc(Long ownerId);

    // @Query("""
    //     SELECT b.vehicleUnit.id
    //     FROM Booking b
    //     WHERE b.vehicle.id = :vehicleId
    //       AND b.vehicleUnit IS NOT NULL
    //       AND b.status IN :blockingStatuses
    //       AND b.startDateTime < :requestedEnd
    //       AND b.endDateTime > :requestedStart
    //     """)

    @Query("""
    SELECT b.vehicleUnit.id
    FROM Booking b
    WHERE b.vehicle.id = :vehicleId
      AND b.vehicleUnit IS NOT NULL
      AND b.startDateTime < :requestedEnd
      AND b.endDateTime > :requestedStart
      AND (
            b.status IN :activeStatuses
            OR (
                b.status = com.renstant.backend.entity.BookingStatus.PAYMENT_PENDING
                AND b.paymentExpiresAt > :now
            )
          )
    """)
List<Long> findUnavailableUnitIds(
        @Param("vehicleId") Long vehicleId,
        @Param("requestedStart") LocalDateTime requestedStart,
        @Param("requestedEnd") LocalDateTime requestedEnd,
        @Param("activeStatuses") List<BookingStatus> activeStatuses,
        @Param("now") LocalDateTime now
);
    // List<Long> findUnavailableUnitIds(
    //         @Param("vehicleId") Long vehicleId,
    //         @Param("requestedStart") LocalDateTime requestedStart,
    //         @Param("requestedEnd") LocalDateTime requestedEnd,
    //         @Param("blockingStatuses") List<BookingStatus> blockingStatuses
    // );


    List<Booking> findByStatusAndPaymentExpiresAtBefore(
        BookingStatus status,
        LocalDateTime time
);


// @Lock(LockModeType.PESSIMISTIC_WRITE)
// @Query("""
//     SELECT b
//     FROM Booking b
//     WHERE b.id = :bookingId
// """)
// Optional<Booking> findByIdForUpdate(
//         @Param("bookingId") Long bookingId
// );


@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("""
    SELECT b
    FROM Booking b
    WHERE b.id = :bookingId
""")
Optional<Booking> findByIdForUpdate(
        @Param("bookingId") Long bookingId
);
}