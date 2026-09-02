package com.renstant.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class ShopClosureResponse {

    private Long id;

    private LocalDate startDate;

    private LocalDate endDate;
}