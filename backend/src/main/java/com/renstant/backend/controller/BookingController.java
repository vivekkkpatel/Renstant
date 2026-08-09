package com.renstant.backend.controller;

import com.renstant.backend.dto.BookingResponse;
import com.renstant.backend.dto.CreateBookingRequest;
import com.renstant.backend.entity.Booking;
import com.renstant.backend.entity.User;
import com.renstant.backend.service.BookingService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            Authentication authentication) {

        User customer = (User) authentication.getPrincipal();

        Booking booking =
                bookingService.createBooking(request, customer);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toResponse(booking));
    }

    private BookingResponse toResponse(Booking booking) {

        return new BookingResponse(
                booking.getId(),
                booking.getVehicle().getId(),
                booking.getVehicle().getName(),
                booking.getVehicleUnit().getId(),
                booking.getStartDateTime(),
                booking.getEndDateTime(),
                booking.getTotalPrice(),
                booking.getStatus(),
                booking.getPickupType(),
                booking.getDeliveryAddress()
        );
    }

    @GetMapping
public ResponseEntity<List<BookingResponse>> getMyBookings(
        Authentication authentication) {

    User customer = (User) authentication.getPrincipal();

    List<BookingResponse> bookings =
            bookingService.getCustomerBookings(customer)
                    .stream()
                    .map(this::toResponse)
                    .toList();

    return ResponseEntity.ok(bookings);
}

@GetMapping("/{bookingId}")
public ResponseEntity<BookingResponse> getBooking(
        @PathVariable Long bookingId,
        Authentication authentication) {

    User customer = (User) authentication.getPrincipal();

    Booking booking =
            bookingService.getCustomerBooking(
                    bookingId,
                    customer
            );

    return ResponseEntity.ok(toResponse(booking));
}

@PatchMapping("/{bookingId}/cancel")
public ResponseEntity<BookingResponse> cancelBooking(
        @PathVariable Long bookingId,
        Authentication authentication) {

    User customer = (User) authentication.getPrincipal();

    Booking booking =
            bookingService.cancelBooking(
                    bookingId,
                    customer
            );

    return ResponseEntity.ok(toResponse(booking));
}

}