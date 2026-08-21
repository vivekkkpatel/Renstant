package com.renstant.backend.service;

import com.renstant.backend.entity.Booking;
import com.renstant.backend.entity.BookingStatus;
import com.renstant.backend.repository.BookingRepository;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingExpiryService {

    private final BookingRepository bookingRepository;

    public BookingExpiryService(
            BookingRepository bookingRepository) {

        this.bookingRepository = bookingRepository;
    }

    // @Scheduled(fixedRate = 30_000)
    // @Transactional
    // public void expirePendingBookings() {

    //     LocalDateTime now = LocalDateTime.now();

    //     List<Booking> expiredBookings =
    //             bookingRepository
    //                     .findByStatusAndPaymentExpiresAtBefore(
    //                             BookingStatus.PAYMENT_PENDING,
    //                             now
    //                     );

    //     for (Booking booking : expiredBookings) {

    //         booking.setStatus(BookingStatus.CANCELLED);
    //     }

    //     if (!expiredBookings.isEmpty()) {

    //         bookingRepository.saveAll(expiredBookings);
    //     }
    // }


    @Scheduled(fixedRate = 30_000)
@Transactional
public void expirePendingBookings() {

    LocalDateTime now = LocalDateTime.now();

    List<Booking> expiredBookings =
            bookingRepository
                    .findByStatusAndPaymentExpiresAtBefore(
                            BookingStatus.PAYMENT_PENDING,
                            now
                    );

    for (Booking expiredBooking : expiredBookings) {

        Booking booking =
                bookingRepository
                        .findByIdForUpdate(expiredBooking.getId())
                        .orElse(null);

        if (booking == null) {
            continue;
        }

        // Re-check after acquiring the lock.
        // Another transaction may have already processed it.
        if (booking.getStatus() != BookingStatus.PAYMENT_PENDING) {
            continue;
        }

        if (booking.getPaymentExpiresAt() == null ||
                booking.getPaymentExpiresAt().isAfter(now)) {
            continue;
        }

        booking.setStatus(BookingStatus.CANCELLED);
    }
}
}