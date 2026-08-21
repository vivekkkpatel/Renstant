package com.renstant.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class PaymentOrderResponse {

    private Long paymentId;

    private Long bookingId;

    private BigDecimal amount;

    private String currency;

    private String razorpayOrderId;
}