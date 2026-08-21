package com.renstant.backend.service;

import com.renstant.backend.dto.CreateBookingRequest;
import com.renstant.backend.entity.*;
import com.renstant.backend.exception.ConflictException;
import com.renstant.backend.exception.ForbiddenException;
import com.renstant.backend.exception.ResourceNotFoundException;
import com.renstant.backend.repository.BookingRepository;
import com.renstant.backend.repository.VehicleRepository;

import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

import com.renstant.backend.exception.ConflictException;
import com.renstant.backend.exception.ResourceNotFoundException;
import com.renstant.backend.exception.ForbiddenException;

import org.springframework.transaction.annotation.Transactional;

@Service
public class BookingService {

        private final BookingRepository bookingRepository;
        private final VehicleRepository vehicleRepository;
        private final VehicleUnitService vehicleUnitService;

        @Value("${booking.payment-expiry-minutes}")
        private long paymentExpiryMinutes;

        public BookingService(
                        BookingRepository bookingRepository,
                        VehicleRepository vehicleRepository,
                        VehicleUnitService vehicleUnitService) {

                this.bookingRepository = bookingRepository;
                this.vehicleRepository = vehicleRepository;
                this.vehicleUnitService = vehicleUnitService;
        }

        @Transactional
        public Booking createBooking(
                        CreateBookingRequest request,
                        User customer) {

                LocalDateTime start = request.getStartDateTime();
                LocalDateTime end = request.getEndDateTime();

                if (!start.isBefore(end)) {
                        throw new IllegalArgumentException(
                                        "Start date/time must be before end date/time");
                }

                if (start.isBefore(LocalDateTime.now())) {
                        throw new IllegalArgumentException(
                                        "Booking cannot start in the past");
                }

                if (request.getPickupType() == PickupType.DELIVERY &&
                                (request.getDeliveryAddress() == null ||
                                                request.getDeliveryAddress().isBlank())) {

                        throw new IllegalArgumentException(
                                        "Delivery address is required for delivery");
                }

                Vehicle vehicle = vehicleRepository
                                .findById(request.getVehicleId())
                                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
                if (!Boolean.TRUE.equals(vehicle.getActive())) {
                        throw new ConflictException(
                                        "Vehicle is currently unavailable for booking");
                }

                List<VehicleUnit> availableUnits = vehicleUnitService.getAvailableUnitsForBooking(
                                vehicle.getId(),
                                start,
                                end);

                if (availableUnits.isEmpty()) {
                        throw new ConflictException(
                                        "No vehicle available for selected dates");
                }

                // Assign one actual physical vehicle
                VehicleUnit selectedUnit = availableUnits.get(0);

                long minutes = Duration.between(start, end).toMinutes();

                // Any partial day counts as one rental day
                long days = Math.max(1, (minutes + 1439) / 1440);

                BigDecimal totalPrice = vehicle.getPricePerDay()
                                .multiply(BigDecimal.valueOf(days));

                Booking booking = new Booking();

                booking.setCustomer(customer);
                booking.setVehicle(vehicle);
                booking.setVehicleUnit(selectedUnit);

                booking.setStartDateTime(start);
                booking.setEndDateTime(end);

                booking.setTotalPrice(totalPrice);
                booking.setStatus(BookingStatus.PAYMENT_PENDING);
                booking.setPaymentExpiresAt(
        LocalDateTime.now().plusMinutes(paymentExpiryMinutes)
);

                booking.setPickupType(request.getPickupType());

                if (request.getPickupType() == PickupType.DELIVERY) {
                        booking.setDeliveryAddress(
                                        request.getDeliveryAddress().trim());
                } else {
                        booking.setDeliveryAddress(null);
                }

                return bookingRepository.save(booking);
        }

        public List<Booking> getCustomerBookings(User customer) {

                return bookingRepository
                                .findByCustomerIdOrderByCreatedAtDesc(customer.getId());
        }

        public Booking getCustomerBooking(
                        Long bookingId,
                        User customer) {

                Booking booking = bookingRepository.findById(bookingId)
                                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

                if (!booking.getCustomer().getId().equals(customer.getId())) {
                        throw new ForbiddenException(
                                        "You are not allowed to access this booking");
                }

                return booking;
        }

        @Transactional
        public Booking cancelBooking(
                        Long bookingId,
                        User customer) {

                Booking booking = getCustomerBooking(bookingId, customer);

                if (booking.getStatus() == BookingStatus.CANCELLED) {
                        throw new ConflictException(
                                        "Booking is already cancelled");
                }

                if (booking.getStatus() == BookingStatus.COMPLETED) {
                        throw new ConflictException(
                                        "Completed booking cannot be cancelled");
                }

                if (booking.getStatus() == BookingStatus.ACTIVE) {
                        throw new ConflictException(
                                        "Active booking cannot be cancelled");
                }

                booking.setStatus(BookingStatus.CANCELLED);

                return bookingRepository.save(booking);
        }

        public List<Booking> getPartnerBookings(User partner) {

                return bookingRepository
                                .findByVehicleShopOwnerIdOrderByCreatedAtDesc(
                                                partner.getId());
        }

        public Booking getPartnerBooking(
                        Long bookingId,
                        User partner) {

                Booking booking = bookingRepository.findById(bookingId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Booking not found"));

                Long ownerId = booking
                                .getVehicle()
                                .getShop()
                                .getOwner()
                                .getId();

                if (!ownerId.equals(partner.getId())) {
                        throw new ForbiddenException(
                                        "You are not allowed to manage this booking");
                }

                return booking;
        }

        @Transactional
        public Booking confirmBooking(
                        Long bookingId,
                        User partner) {

                Booking booking = getPartnerBooking(bookingId, partner);

                if (booking.getStatus() != BookingStatus.PENDING) {
                        throw new ConflictException(
                                        "Only pending bookings can be confirmed");
                }

                booking.setStatus(BookingStatus.CONFIRMED);

                return bookingRepository.save(booking);
        }

        // @Transactional
        // public Booking activateBooking(
        //                 Long bookingId,
        //                 User partner) {

        //         Booking booking = getPartnerBooking(bookingId, partner);

        //         if (booking.getStatus() != BookingStatus.CONFIRMED) {
        //                 throw new ConflictException(
        //                                 "Only confirmed bookings can be activated");
        //         }

        //         booking.setStatus(BookingStatus.ACTIVE);

        //         return bookingRepository.save(booking);
        // }

        @Transactional
public Booking activateBooking(
        Long bookingId,
        User partner) {

    Booking booking = getPartnerBooking(bookingId, partner);

    // Booking must be confirmed before it can become active
    if (booking.getStatus() != BookingStatus.CONFIRMED) {
        throw new ConflictException(
                "Only confirmed bookings can be activated"
        );
    }

    // Rental cannot be started before its scheduled start time
    if (LocalDateTime.now().isBefore(booking.getStartDateTime())) {
        throw new ConflictException(
                "Booking cannot be activated before the rental start time"
        );
    }

    booking.setStatus(BookingStatus.ACTIVE);

    return bookingRepository.save(booking);
}

        @Transactional
        public Booking completeBooking(
                        Long bookingId,
                        User partner) {

                Booking booking = getPartnerBooking(bookingId, partner);

                if (booking.getStatus() != BookingStatus.ACTIVE) {
                        throw new ConflictException(
                                        "Only active bookings can be completed");
                }

                booking.setStatus(BookingStatus.COMPLETED);

                return bookingRepository.save(booking);
        }
}