package com.renstant.backend.controller;

import com.renstant.backend.dto.BookingResponse;
import com.renstant.backend.entity.Booking;
import com.renstant.backend.entity.User;
import com.renstant.backend.service.BookingService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partner/bookings")
public class PartnerBookingController {

    private final BookingService bookingService;

    public PartnerBookingController(
            BookingService bookingService) {

        this.bookingService = bookingService;
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getBookings(
            Authentication authentication) {

        User partner = (User) authentication.getPrincipal();

        List<BookingResponse> bookings =
                bookingService.getPartnerBookings(partner)
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponse> getBooking(
            @PathVariable Long bookingId,
            Authentication authentication) {

        User partner = (User) authentication.getPrincipal();

        Booking booking =
                bookingService.getPartnerBooking(
                        bookingId,
                        partner
                );

        return ResponseEntity.ok(toResponse(booking));
    }

    @PatchMapping("/{bookingId}/confirm")
    public ResponseEntity<BookingResponse> confirmBooking(
            @PathVariable Long bookingId,
            Authentication authentication) {

        User partner = (User) authentication.getPrincipal();

        Booking booking =
                bookingService.confirmBooking(
                        bookingId,
                        partner
                );

        return ResponseEntity.ok(toResponse(booking));
    }

    @PatchMapping("/{bookingId}/activate")
    public ResponseEntity<BookingResponse> activateBooking(
            @PathVariable Long bookingId,
            Authentication authentication) {

        User partner = (User) authentication.getPrincipal();

        Booking booking =
                bookingService.activateBooking(
                        bookingId,
                        partner
                );

        return ResponseEntity.ok(toResponse(booking));
    }

    @PatchMapping("/{bookingId}/complete")
    public ResponseEntity<BookingResponse> completeBooking(
            @PathVariable Long bookingId,
            Authentication authentication) {

        User partner = (User) authentication.getPrincipal();

        Booking booking =
                bookingService.completeBooking(
                        bookingId,
                        partner
                );

        return ResponseEntity.ok(toResponse(booking));
    }

    private BookingResponse toResponse(Booking booking) {

        return new BookingResponse(
                booking.getId(),
                booking.getVehicle().getId(),
                booking.getVehicle().getName(),
                booking.getVehicleUnit() != null
        ? booking.getVehicleUnit().getId()
        : null,
                booking.getStartDateTime(),
                booking.getEndDateTime(),
                booking.getTotalPrice(),
                booking.getStatus(),
                booking.getPickupType(),
                booking.getDeliveryAddress()
        );
    }
}