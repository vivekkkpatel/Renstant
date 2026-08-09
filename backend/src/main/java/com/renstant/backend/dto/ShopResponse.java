package com.renstant.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ShopResponse {

    private Long id;
    private String name;
    private String description;
    private String phone;

    private String addressLine;
    private String city;
    private String state;
    private String pincode;

    private Double latitude;
    private Double longitude;

    private Double rating;
    private Boolean active;
    private Boolean temporarilyClosed;

    private Long ownerId;
    private String ownerName;
}