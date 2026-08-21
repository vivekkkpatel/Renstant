import { useEffect, useState } from "react";
import { CheckCircle, MapPin, CalendarDays, Clock } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { getBookingById } from "../services/bookingService";
import { createPaymentOrder, verifyPayment } from "../services/paymentService";

function BookingConfirmation() {

    const { bookingId } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [paying, setPaying] = useState(false);

    useEffect(() => {

        const fetchBooking = async () => {

            try {

                const data =
                    await getBookingById(bookingId);

                setBooking(data);

            } catch (err) {

                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load booking."
                );

            } finally {

                setLoading(false);

            }
        };

        fetchBooking();

    }, [bookingId]);

    const handlePayment = async () => {

    try {

        setPaying(true);
        setError("");

        // 1. Create Razorpay order from backend
        const order = await createPaymentOrder(booking.id);

        // 2. Open Razorpay Checkout
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,

            amount: Math.round(Number(order.amount) * 100),

            currency: order.currency,

            name: "Renstant",

            description: `Payment for ${booking.vehicleName}`,

            order_id: order.razorpayOrderId,

            handler: async function (response) {

    try {

        console.log(
            "Razorpay payment successful:",
            response
        );

        // 1. Verify payment on backend
        await verifyPayment({
            razorpayOrderId:
                response.razorpay_order_id,

            razorpayPaymentId:
                response.razorpay_payment_id,

            razorpaySignature:
                response.razorpay_signature,
        });

        // 2. Fetch updated booking
        const updatedBooking =
            await getBookingById(booking.id);

        // 3. Update page immediately
        setBooking(updatedBooking);

    } catch (err) {

        console.error(err);

        setError(
            err.response?.data?.message ||
            "Payment verification failed."
        );

    } finally {

        setPaying(false);

    }
},

    //         handler: async function (response) {

    //             console.log(
    //     "Razorpay payment successful:",
    //     response
    // );

    //             try {

    //                 // 3. Verify payment on backend
    //                 await verifyPayment({
    //                     razorpayOrderId:
    //                         response.razorpay_order_id,

    //                     razorpayPaymentId:
    //                         response.razorpay_payment_id,

    //                     razorpaySignature:
    //                         response.razorpay_signature,
    //                 });

    //                 // 4. Payment verified
    //                 navigate(`/bookings/${booking.id}`);

    //             } catch (err) {

    //                 console.error(err);

    //                 setError(
    //                     err.response?.data?.message ||
    //                     "Payment verification failed."
    //                 );

    //             } finally {

    //                 setPaying(false);

    //             }
    //         },

            prefill: {
                name: "",
                email: "",
            },

            theme: {
                color: "#111827",
            },
        };

        const razorpay = new window.Razorpay(options);

        // razorpay.on("payment.failed", function () {

        //     setError(
        //         "Payment failed. Please try again."
        //     );

        //     setPaying(false);

        // });

        razorpay.on("payment.failed", function (response) {

    console.error(
        "Razorpay payment failed:",
        response
    );

    console.error(
        "Error:",
        response.error
    );

    setError(
        response.error?.description ||
        "Payment failed. Please try again."
    );

    setPaying(false);

});

        razorpay.open();

    } catch (err) {

        console.error(err);

        setError(
            err.response?.data?.message ||
            "Unable to start payment."
        );

        setPaying(false);
    }
};

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-gray-500">
                    Loading booking...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">

                <div className="w-full max-w-lg rounded-2xl bg-red-50 p-6 text-center text-red-700">
                    {error}
                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            <main className="mx-auto max-w-3xl px-6 py-12">

                {/* Success */}

                <div className="text-center">

                    <CheckCircle
                        size={64}
                        className="mx-auto text-green-600"
                    />

                    {/* <h1 className="mt-5 text-3xl font-bold text-gray-900">
                        Booking Created!
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Your rental booking has been successfully created.
                    </p> */}

                    <h1 className="mt-5 text-3xl font-bold text-gray-900">
    {booking.status === "PAYMENT_PENDING"
        ? "Complete Your Payment"
        : booking.status === "CONFIRMED"
        ? "Booking Confirmed!"
        : "Booking"}
</h1>

<p className="mt-2 text-gray-500">
    {booking.status === "PAYMENT_PENDING"
        ? "Your vehicle has been temporarily reserved. Complete payment to confirm your booking."
        : booking.status === "CONFIRMED"
        ? "Your rental booking has been successfully confirmed."
        : "Your booking details are shown below."}
</p>

                </div>

                {/* Booking Card */}

                <div className="mt-10 rounded-3xl bg-white p-8 shadow-sm">

                    <div className="flex items-center justify-between border-b pb-6">

                        <div>

                            <p className="text-sm text-gray-500">
                                Booking ID
                            </p>

                            <p className="mt-1 text-xl font-bold text-gray-900">
                                #{booking.id}
                            </p>

                        </div>

                        {/* <span className="rounded-full bg-yellow-50 px-4 py-2 text-sm font-semibold text-yellow-700">
                            {booking.status}
                        </span> */}

                        <span
    className={`rounded-full px-4 py-2 text-sm font-semibold ${
        booking.status === "PAYMENT_PENDING"
            ? "bg-yellow-50 text-yellow-700"
            : booking.status === "CONFIRMED"
            ? "bg-green-50 text-green-700"
            : "bg-gray-100 text-gray-700"
    }`}
>
    {booking.status === "PAYMENT_PENDING"
        ? "PAYMENT PENDING"
        : booking.status === "CONFIRMED"
        ? "CONFIRMED"
        : booking.status}
</span>

                    </div>

                    {/* Vehicle */}

                    <div className="mt-6">

                        <p className="text-sm text-gray-500">
                            Vehicle
                        </p>

                        <h2 className="mt-1 text-2xl font-bold text-gray-900">
                            {booking.vehicleName}
                        </h2>

                    </div>

                    {/* Details */}

                    <div className="mt-8 grid gap-5 md:grid-cols-2">

                        <div className="flex gap-3">

                            <CalendarDays
                                size={20}
                                className="mt-1 text-gray-400"
                            />

                            <div>

                                <p className="text-sm text-gray-500">
                                    Pickup
                                </p>

                                <p className="font-medium text-gray-900">
                                    {booking.startDateTime.replace(
                                        "T",
                                        " "
                                    )}
                                </p>

                            </div>

                        </div>

                        <div className="flex gap-3">

                            <Clock
                                size={20}
                                className="mt-1 text-gray-400"
                            />

                            <div>

                                <p className="text-sm text-gray-500">
                                    Return
                                </p>

                                <p className="font-medium text-gray-900">
                                    {booking.endDateTime.replace(
                                        "T",
                                        " "
                                    )}
                                </p>

                            </div>

                        </div>

                        <div className="flex gap-3">

                            <MapPin
                                size={20}
                                className="mt-1 text-gray-400"
                            />

                            <div>

                                <p className="text-sm text-gray-500">
                                    Pickup option
                                </p>

                                <p className="font-medium text-gray-900">
                                    {booking.pickupType ===
                                    "SHOP_PICKUP"
                                        ? "Shop Pickup"
                                        : "Delivery"}
                                </p>

                            </div>

                        </div>

                        <div>

                            <p className="text-sm text-gray-500">
                                Total price
                            </p>

                            <p className="text-xl font-bold text-gray-900">
                                ₹{booking.totalPrice}
                            </p>

                        </div>

                    </div>

                    {booking.deliveryAddress && (
                        <div className="mt-6 rounded-xl bg-gray-50 p-4">

                            <p className="text-sm text-gray-500">
                                Delivery address
                            </p>

                            <p className="mt-1 font-medium text-gray-900">
                                {booking.deliveryAddress}
                            </p>

                        </div>
                    )}

                    {/* Actions */}

                    {/* <div className="mt-8 grid gap-3 sm:grid-cols-2">

                        <button
    onClick={handlePayment}
    disabled={paying}
    className="rounded-xl bg-gray-900 py-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
>
    {paying ? "Opening Payment..." : "Pay Now"}
</button>

                        <button
                            onClick={() =>
                                navigate("/")
                            }
                            className="rounded-xl border border-gray-200 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Back to Home
                        </button>

                    </div> */}

                    {/* Actions */}

<div className="mt-8">

    {booking.status === "PAYMENT_PENDING" && (
        <div className="grid gap-3 sm:grid-cols-2">

            <button
                onClick={handlePayment}
                disabled={paying}
                className="rounded-xl bg-gray-900 py-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {paying
                    ? "Opening Payment..."
                    : "Pay Now"}
            </button>

            <button
                onClick={() => navigate("/")}
                className="rounded-xl border border-gray-200 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
                Back to Home
            </button>

        </div>
    )}

    {booking.status === "CONFIRMED" && (
        <div className="grid gap-3 sm:grid-cols-2">

            <button
                onClick={() =>
                    navigate("/bookings")
                }
                className="rounded-xl bg-gray-900 py-3 font-semibold text-white hover:bg-gray-800"
            >
                View My Bookings
            </button>

            <button
                onClick={() => navigate("/")}
                className="rounded-xl border border-gray-200 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
                Back to Home
            </button>

        </div>
    )}

</div>

                </div>

            </main>

        </div>
    );
}

export default BookingConfirmation;