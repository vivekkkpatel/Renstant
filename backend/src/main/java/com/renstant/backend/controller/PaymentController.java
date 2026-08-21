package com.renstant.backend.controller;

import com.renstant.backend.dto.PaymentOrderResponse;
import com.renstant.backend.entity.Payment;
import com.renstant.backend.entity.User;
import com.renstant.backend.service.PaymentService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.renstant.backend.dto.VerifyPaymentRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(
            PaymentService paymentService) {

        this.paymentService = paymentService;
    }

    @PostMapping("/create-order/{bookingId}")
    public ResponseEntity<PaymentOrderResponse> createOrder(
            @PathVariable Long bookingId,
            Authentication authentication) throws Exception {

        User customer =
                (User) authentication.getPrincipal();

        Payment payment =
                paymentService.createPaymentOrder(
                        bookingId,
                        customer.getId()
                );

        PaymentOrderResponse response =
                new PaymentOrderResponse(
                        payment.getId(),
                        payment.getBooking().getId(),
                        payment.getAmount(),
                        "INR",
                        payment.getRazorpayOrderId()
                );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
public ResponseEntity<String> verifyPayment(
        @Valid @RequestBody VerifyPaymentRequest request,
        Authentication authentication) throws Exception {

    User customer =
            (User) authentication.getPrincipal();

    paymentService.verifyPayment(
            request.getRazorpayOrderId(),
            request.getRazorpayPaymentId(),
            request.getRazorpaySignature(),
            customer.getId()
    );

    return ResponseEntity.ok(
            "Payment verified successfully"
    );
}
}