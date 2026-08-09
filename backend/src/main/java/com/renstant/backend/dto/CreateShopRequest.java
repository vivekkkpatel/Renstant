package com.renstant.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateShopRequest {

    @NotBlank
    private String name;

    private String description;

    @NotBlank
    private String phone;

    @NotBlank
    private String addressLine;

    @NotBlank
    private String city;

    @NotBlank
    private String state;

    @NotBlank
    private String pincode;

    private Double latitude;

    private Double longitude;
}