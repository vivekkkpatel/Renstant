package com.renstant.backend.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.renstant.backend.entity.Booking;
import com.renstant.backend.entity.BookingStatus;
import com.renstant.backend.entity.Payment;
import com.renstant.backend.entity.PaymentStatus;
import com.renstant.backend.exception.ConflictException;
import com.renstant.backend.exception.ResourceNotFoundException;
import com.renstant.backend.repository.BookingRepository;
import com.renstant.backend.repository.PaymentRepository;

import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import com.razorpay.Utils;

import java.math.BigDecimal;
import org.springframework.beans.factory.annotation.Value;


@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final RazorpayClient razorpayClient;

    @Value("${razorpay.key.secret}")
private String razorpaySecret;



    public PaymentService(
            PaymentRepository paymentRepository,
            BookingRepository bookingRepository,
            RazorpayClient razorpayClient) {

        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.razorpayClient = razorpayClient;
    }

    private String getRazorpaySecret() {
    return razorpaySecret;
}

//     @Transactional
//     public Payment createPaymentOrder(
//             Long bookingId,
//             Long customerId) throws Exception {

//         Booking booking = bookingRepository.findById(bookingId)
//                 .orElseThrow(() ->
//                         new ResourceNotFoundException(
//                                 "Booking not found"));

//         // Make sure this booking belongs to the customer
//         if (!booking.getCustomer()
//                 .getId()
//                 .equals(customerId)) {

//             throw new ConflictException(
//                     "You are not allowed to pay for this booking");
//         }

//         // Don't create another payment for the same booking
//         if (paymentRepository
//                 .findByBookingId(bookingId)
//                 .isPresent()) {

//             throw new ConflictException(
//                     "Payment already exists for this booking");
//         }

//         BigDecimal amount = booking.getTotalPrice();

//         // Razorpay expects amount in paise
//         long amountInPaise = amount
//                 .multiply(BigDecimal.valueOf(100))
//                 .longValueExact();

//         JSONObject orderRequest = new JSONObject();

//         orderRequest.put(
//                 "amount",
//                 amountInPaise
//         );

//         orderRequest.put(
//                 "currency",
//                 "INR"
//         );

//         orderRequest.put(
//                 "receipt",
//                 "booking_" + bookingId
//         );

//         Order order =
//                 razorpayClient.orders.create(orderRequest);

//         Payment payment = new Payment();

//         payment.setBooking(booking);
//         payment.setAmount(amount);
//         payment.setRazorpayOrderId(
//                 order.get("id")
//         );
//         payment.setStatus(
//                 PaymentStatus.CREATED
//         );

//         return paymentRepository.save(payment);
//     }

@Transactional
public Payment createPaymentOrder(
        Long bookingId,
        Long customerId) throws Exception {

    Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Booking not found"));

    // Make sure this booking belongs to the customer
    if (!booking.getCustomer()
            .getId()
            .equals(customerId)) {

        throw new ConflictException(
                "You are not allowed to pay for this booking");
    }

    // Payment is allowed only while booking is awaiting payment
    if (booking.getStatus() != BookingStatus.PAYMENT_PENDING) {

        throw new ConflictException(
                "This booking is not awaiting payment");
    }

    BigDecimal amount = booking.getTotalPrice();

    // Razorpay expects amount in paise
    long amountInPaise = amount
            .multiply(BigDecimal.valueOf(100))
            .longValueExact();

    JSONObject orderRequest = new JSONObject();

    orderRequest.put(
            "amount",
            amountInPaise
    );

    orderRequest.put(
            "currency",
            "INR"
    );

    orderRequest.put(
            "receipt",
            "booking_" + bookingId
    );

    // Create a NEW Razorpay order for every payment attempt
    Order order =
            razorpayClient.orders.create(orderRequest);

    Payment payment =
            paymentRepository
                    .findByBookingId(bookingId)
                    .orElseGet(Payment::new);

    // If this is an existing payment record,
    // we are retrying the payment.
    payment.setBooking(booking);
    payment.setAmount(amount);

    // Replace old Razorpay order with the new one
    payment.setRazorpayOrderId(
            order.get("id")
    );

    // Clear previous payment attempt details
    payment.setRazorpayPaymentId(null);
    payment.setRazorpaySignature(null);

    // New attempt is waiting for payment
    payment.setStatus(
            PaymentStatus.CREATED
    );

    payment.setPaidAt(null);

    return paymentRepository.save(payment);
}

//     @Transactional
// public Payment verifyPayment(
//         String razorpayOrderId,
//         String razorpayPaymentId,
//         String razorpaySignature,
//         Long customerId) throws Exception {

//     Payment payment = paymentRepository
//             .findByRazorpayOrderId(razorpayOrderId)
//             .orElseThrow(() ->
//                     new ResourceNotFoundException(
//                             "Payment not found"));

//     // Make sure this payment belongs to the customer
//     if (!payment.getBooking()
//             .getCustomer()
//             .getId()
//             .equals(customerId)) {

//         throw new ConflictException(
//                 "You are not allowed to verify this payment");
//     }

//     // Don't verify an already-paid payment again
//     if (payment.getStatus() == PaymentStatus.PAID) {
//         return payment;
//     }

//     String payload =
//             razorpayOrderId + "|" + razorpayPaymentId;

//     boolean valid = Utils.verifySignature(
//             payload,
//             razorpaySignature,
//             getRazorpaySecret()
//     );

//     if (!valid) {
//         payment.setStatus(PaymentStatus.FAILED);
//         paymentRepository.save(payment);

//         throw new ConflictException(
//                 "Payment signature verification failed");
//     }

// //     payment.setRazorpayPaymentId(razorpayPaymentId);
// //     payment.setRazorpaySignature(razorpaySignature);
// //     payment.setStatus(PaymentStatus.PAID);
// //     payment.setPaidAt(java.time.LocalDateTime.now());

// //     return paymentRepository.save(payment);


// // payment.setRazorpayPaymentId(razorpayPaymentId);
// // payment.setRazorpaySignature(razorpaySignature);
// // payment.setStatus(PaymentStatus.PAID);
// // payment.setPaidAt(java.time.LocalDateTime.now());

// // Booking booking = payment.getBooking();

// // booking.setStatus(BookingStatus.PENDING);

// // bookingRepository.save(booking);

// // return paymentRepository.save(payment);

// payment.setRazorpayPaymentId(razorpayPaymentId);
// payment.setRazorpaySignature(razorpaySignature);
// payment.setStatus(PaymentStatus.PAID);
// payment.setPaidAt(java.time.LocalDateTime.now());

// Booking booking = payment.getBooking();

// booking.setStatus(BookingStatus.CONFIRMED);

// bookingRepository.save(booking);

// return paymentRepository.save(payment);
// }


// @Transactional
// public Payment verifyPayment(
//         String razorpayOrderId,
//         String razorpayPaymentId,
//         String razorpaySignature,
//         Long customerId) throws Exception {

//     Payment payment = paymentRepository
//             .findByRazorpayOrderId(razorpayOrderId)
//             .orElseThrow(() ->
//                     new ResourceNotFoundException(
//                             "Payment not found"));

//     Booking booking = payment.getBooking();

//     // Make sure this payment belongs to the customer
//     if (!booking.getCustomer()
//             .getId()
//             .equals(customerId)) {

//         throw new ConflictException(
//                 "You are not allowed to verify this payment");
//     }

//     // Payment can only happen while booking is awaiting payment
//     if (booking.getStatus() != BookingStatus.PAYMENT_PENDING) {

//         throw new ConflictException(
//                 "This booking is no longer available for payment");
//     }

//     // Make sure the 15-minute payment window has not expired
//     if (booking.getPaymentExpiresAt() == null ||
//             !LocalDateTime.now().isBefore(
//                     booking.getPaymentExpiresAt())) {

//         throw new ConflictException(
//                 "Payment window has expired");
//     }

//     // Don't verify an already-paid payment again
//     if (payment.getStatus() == PaymentStatus.PAID) {
//         return payment;
//     }

//     Booking booking = payment.getBooking();

// if (booking.getStatus() != BookingStatus.PAYMENT_PENDING) {
//     throw new ConflictException(
//             "This booking is no longer awaiting payment"
//     );
// }

// if (booking.getPaymentExpiresAt() == null ||
//         !booking.getPaymentExpiresAt().isAfter(java.time.LocalDateTime.now())) {

//     throw new ConflictException(
//             "Payment window has expired"
//     );
// }



//     String payload =
//             razorpayOrderId + "|" + razorpayPaymentId;

//     boolean valid = Utils.verifySignature(
//             payload,
//             razorpaySignature,
//             getRazorpaySecret()
//     );

//     if (!valid) {

//         payment.setStatus(PaymentStatus.FAILED);

//         paymentRepository.save(payment);

//         throw new ConflictException(
//                 "Payment signature verification failed");
//     }

//     // Payment successfully verified
//     payment.setRazorpayPaymentId(
//             razorpayPaymentId
//     );

//     payment.setRazorpaySignature(
//             razorpaySignature
//     );

//     payment.setStatus(
//             PaymentStatus.PAID
//     );

//     payment.setPaidAt(
//             LocalDateTime.now()
//     );

//     // The physical unit was already temporarily
//     // reserved when the booking was created.
//     // Successful payment makes that reservation permanent.
//     booking.setStatus(
//             BookingStatus.CONFIRMED
//     );

//     bookingRepository.save(booking);

//     return paymentRepository.save(payment);
// }

@Transactional
public Payment verifyPayment(
        String razorpayOrderId,
        String razorpayPaymentId,
        String razorpaySignature,
        Long customerId) throws Exception {

                Payment payment = paymentRepository
        .findByRazorpayOrderId(razorpayOrderId)
        .orElseThrow(() ->
                new ResourceNotFoundException(
                        "Payment not found"));

Booking booking =
        bookingRepository
                .findByIdForUpdate(payment.getBooking().getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found"));

//     Payment payment = paymentRepository
//             .findByRazorpayOrderId(razorpayOrderId)
//             .orElseThrow(() ->
//                     new ResourceNotFoundException(
//                             "Payment not found"));

//         //     Booking booking = payment.getBooking();

//         Booking booking = bookingRepository
//         .findByIdForUpdate(payment.getBooking().getId())
//         .orElseThrow(() ->
//                 new ResourceNotFoundException(
//                         "Booking not found"));


    // ---------------------------------------------------------
    // 1. Make sure this payment belongs to the customer
    // ---------------------------------------------------------
    if (!booking.getCustomer()
            .getId()
            .equals(customerId)) {

        throw new ConflictException(
                "You are not allowed to verify this payment");
    }

    // ---------------------------------------------------------
    // 2. Idempotency:
    // If payment was already successfully verified,
    // do not process it again.
    // ---------------------------------------------------------
    if (payment.getStatus() == PaymentStatus.PAID) {
        return payment;
    }

    // ---------------------------------------------------------
    // 3. Booking must still be waiting for payment
    // ---------------------------------------------------------
    if (booking.getStatus() != BookingStatus.PAYMENT_PENDING) {

        throw new ConflictException(
                "This booking is no longer available for payment");
    }

    // ---------------------------------------------------------
    // 4. Payment window must not have expired
    // ---------------------------------------------------------
    if (booking.getPaymentExpiresAt() == null ||
            !LocalDateTime.now().isBefore(
                    booking.getPaymentExpiresAt())) {

        throw new ConflictException(
                "Payment window has expired");
    }

    // ---------------------------------------------------------
    // 5. Verify Razorpay signature
    // ---------------------------------------------------------
    String payload =
            razorpayOrderId + "|" + razorpayPaymentId;

    boolean valid = Utils.verifySignature(
            payload,
            razorpaySignature,
            getRazorpaySecret()
    );

    if (!valid) {

        payment.setStatus(PaymentStatus.FAILED);

        paymentRepository.save(payment);

        throw new ConflictException(
                "Payment signature verification failed");
    }

    // ---------------------------------------------------------
    // 6. Payment successfully verified
    // ---------------------------------------------------------
    payment.setRazorpayPaymentId(
            razorpayPaymentId
    );

    payment.setRazorpaySignature(
            razorpaySignature
    );

    payment.setStatus(
            PaymentStatus.PAID
    );

    payment.setPaidAt(
            LocalDateTime.now()
    );

    // ---------------------------------------------------------
    // 7. Convert temporary reservation into confirmed booking
    //
    // The physical VehicleUnit was already reserved when
    // the booking was created.
    // ---------------------------------------------------------
    booking.setStatus(
            BookingStatus.CONFIRMED
    );

    bookingRepository.save(booking);

    return paymentRepository.save(payment);
}

}