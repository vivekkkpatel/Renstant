package com.renstant.backend.service;

import com.renstant.backend.dto.CreateVehicleUnitRequest;

import com.renstant.backend.entity.User;
import com.renstant.backend.entity.Vehicle;
import com.renstant.backend.entity.VehicleUnit;
import com.renstant.backend.entity.VehicleUnitStatus;
import com.renstant.backend.exception.ConflictException;
import com.renstant.backend.exception.ForbiddenException;
import com.renstant.backend.exception.ResourceNotFoundException;
import com.renstant.backend.repository.VehicleRepository;
import com.renstant.backend.repository.VehicleUnitRepository;

import org.springframework.stereotype.Service;

import com.renstant.backend.entity.BookingStatus;
import com.renstant.backend.repository.BookingRepository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class VehicleUnitService {

    private final VehicleUnitRepository vehicleUnitRepository;
    private final VehicleRepository vehicleRepository;
    private final BookingRepository bookingRepository;

    public VehicleUnitService(
        VehicleUnitRepository vehicleUnitRepository,
        VehicleRepository vehicleRepository,
        BookingRepository bookingRepository) {

    this.vehicleUnitRepository = vehicleUnitRepository;
    this.vehicleRepository = vehicleRepository;
    this.bookingRepository = bookingRepository;
}

    public VehicleUnit createUnit(
            Long vehicleId,
            CreateVehicleUnitRequest request,
            User partner) {

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Vehicle not found"));

        // Partner can manage only vehicles belonging to their own shop
        if (!vehicle.getShop().getOwner().getId().equals(partner.getId())) {
            throw new ForbiddenException(
                    "You are not allowed to manage this vehicle"
            );
        }

        if (vehicleUnitRepository.existsByRegistrationNumber(
                request.getRegistrationNumber())) {

            throw new ConflictException(
                    "Registration number already exists"
            );
        }

        VehicleUnit unit = new VehicleUnit();

        unit.setRegistrationNumber(
                request.getRegistrationNumber().toUpperCase()
        );

        unit.setStatus(VehicleUnitStatus.AVAILABLE);
        unit.setVehicle(vehicle);

        return vehicleUnitRepository.save(unit);
    }

    public List<VehicleUnit> getAvailableUnits(
        Long vehicleId,
        LocalDateTime start,
        LocalDateTime end) {

    if (start == null || end == null || !start.isBefore(end)) {
        throw new IllegalArgumentException(
                "Start date/time must be before end date/time"
        );
    }

    // Also verifies that the vehicle actually exists
    Vehicle vehicle = vehicleRepository.findById(vehicleId)
        .orElseThrow(() ->
                new ResourceNotFoundException("Vehicle not found"));

if (!Boolean.TRUE.equals(vehicle.getActive())) {
    return List.of();
}

    List<VehicleUnit> operationalUnits =
            vehicleUnitRepository.findByVehicleIdAndStatus(
                    vehicleId,
                    VehicleUnitStatus.AVAILABLE
            );

    List<BookingStatus> blockingStatuses = List.of(
        BookingStatus.PAYMENT_PENDING,
        BookingStatus.PENDING,
        BookingStatus.CONFIRMED,
        BookingStatus.ACTIVE
);

    List<Long> unavailableIds =
            bookingRepository.findUnavailableUnitIds(
        vehicleId,
        start,
        end,
        blockingStatuses,
        LocalDateTime.now()
);

    return operationalUnits.stream()
            .filter(unit -> !unavailableIds.contains(unit.getId()))
            .toList();
}

public int getTotalOperationalUnits(Long vehicleId) {

    Vehicle vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Vehicle not found"));

    if (!Boolean.TRUE.equals(vehicle.getActive())) {
        return 0;
    }

    return vehicleUnitRepository
            .findByVehicleIdAndStatus(
                    vehicleId,
                    VehicleUnitStatus.AVAILABLE
            )
            .size();
}

public List<VehicleUnit> getAvailableUnitsForBooking(
        Long vehicleId,
        LocalDateTime start,
        LocalDateTime end) {

    List<VehicleUnit> operationalUnits =
            vehicleUnitRepository
                    .findByVehicleIdAndStatusForUpdate(
                            vehicleId,
                            VehicleUnitStatus.AVAILABLE
                    );

    List<BookingStatus> blockingStatuses = List.of(
        BookingStatus.PAYMENT_PENDING,
        BookingStatus.PENDING,
        BookingStatus.CONFIRMED,
        BookingStatus.ACTIVE
);

    List<Long> unavailableIds =
            bookingRepository.findUnavailableUnitIds(
        vehicleId,
        start,
        end,
        blockingStatuses,
        LocalDateTime.now()
);

    return operationalUnits.stream()
            .filter(unit -> !unavailableIds.contains(unit.getId()))
            .toList();
}

public List<VehicleUnit> getPartnerVehicleUnits(
        Long vehicleId,
        User partner) {

    Vehicle vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Vehicle not found"));

    if (!vehicle.getShop()
            .getOwner()
            .getId()
            .equals(partner.getId())) {

        throw new ForbiddenException(
                "You are not allowed to manage this vehicle"
        );
    }

    return vehicleUnitRepository.findByVehicleId(vehicleId);
}

@Transactional
public VehicleUnit updateUnitStatus(
        Long unitId,
        VehicleUnitStatus status,
        User partner) {

    VehicleUnit unit = vehicleUnitRepository.findById(unitId)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Vehicle unit not found"
                    ));

    Long ownerId = unit.getVehicle()
            .getShop()
            .getOwner()
            .getId();

    if (!ownerId.equals(partner.getId())) {
        throw new ForbiddenException(
                "You are not allowed to manage this vehicle unit"
        );
    }

    unit.setStatus(status);

    return vehicleUnitRepository.save(unit);
}
}