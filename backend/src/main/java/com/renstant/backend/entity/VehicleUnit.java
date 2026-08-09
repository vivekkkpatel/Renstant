package com.renstant.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vehicle_units")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VehicleUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String registrationNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleUnitStatus status = VehicleUnitStatus.AVAILABLE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;
}