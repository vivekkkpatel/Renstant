package com.renstant.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "shops")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Shop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private String phone;

    // Location
    @Column(nullable = false)
    private String addressLine;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String pincode;

    private Double latitude;

    private Double longitude;

    // Shop status
    private Double rating = 0.0;

    private Boolean active = true;

    // private Boolean temporarilyClosed = false;

    // private LocalDate closedUntil;

    @OneToMany(
    mappedBy = "shop",
    cascade = CascadeType.ALL,
    orphanRemoval = true
)
private List<ShopOperatingHours> operatingHours = new ArrayList<>();

@OneToMany(
    mappedBy = "shop",
    cascade = CascadeType.ALL,
    orphanRemoval = true
)
private List<ShopClosure> closures = new ArrayList<>();

    // Shop owner
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;
}