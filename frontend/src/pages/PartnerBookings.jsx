import { useEffect, useState } from "react";
import {
    CalendarDays,
    Clock,
    MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
    getPartnerBookings,
    confirmBooking,
    activateBooking,
    completeBooking,
} from "../services/partnerBookingService";

function PartnerBookings() {

    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {

        const fetchBookings = async () => {

            try {

                const data = await getPartnerBookings();

                setBookings(data);

            } catch (err) {

                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load bookings."
                );

            } finally {

                setLoading(false);

            }
        };

        fetchBookings();

    }, []);

    const updateBookingStatus = async (
        bookingId,
        action
    ) => {

        try {

            setUpdatingId(bookingId);

            let updatedBooking;

            if (action === "confirm") {

                updatedBooking =
                    await confirmBooking(bookingId);

            } else if (action === "activate") {

                updatedBooking =
                    await activateBooking(bookingId);

            } else {

                updatedBooking =
                    await completeBooking(bookingId);
            }

            setBookings((currentBookings) =>
                currentBookings.map((booking) =>
                    booking.id === bookingId
                        ? updatedBooking
                        : booking
                )
            );

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Unable to update booking."
            );

        } finally {

            setUpdatingId(null);

        }
    };

    const getStatusClass = (status) => {

        switch (status) {

            case "PENDING":
                return "bg-yellow-50 text-yellow-700";

            case "CONFIRMED":
                return "bg-blue-50 text-blue-700";

            case "ACTIVE":
                return "bg-green-50 text-green-700";

            case "COMPLETED":
                return "bg-gray-100 text-gray-700";

            case "CANCELLED":
                return "bg-red-50 text-red-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    if (loading) {

        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">

                <p className="text-gray-500">
                    Loading bookings...
                </p>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}

            <div className="border-b bg-white">

                <div className="mx-auto max-w-6xl px-6 py-6">

                    <button
                        onClick={() => navigate("/")}
                        className="mb-4 text-sm font-medium text-gray-500 hover:text-gray-900"
                    >
                        ← Back to home
                    </button>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Partner Bookings
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage bookings for your rental vehicles.
                    </p>

                </div>

            </div>

            <main className="mx-auto max-w-6xl px-6 py-10">

                {error && (

                    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
                        {error}
                    </div>

                )}

                {!error && bookings.length === 0 && (

                    <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

                        <h2 className="text-xl font-semibold text-gray-900">
                            No bookings yet
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Bookings for your vehicles will appear here.
                        </p>

                    </div>

                )}

                <div className="space-y-5">

                    {bookings.map((booking) => (

                        <div
                            key={booking.id}
                            className="rounded-3xl bg-white p-6 shadow-sm"
                        >

                            {/* Header */}

                            <div className="flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-start">

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Booking #{booking.id}
                                    </p>

                                    <h2 className="mt-1 text-2xl font-bold text-gray-900">
                                        {booking.vehicleName}
                                    </h2>

                                </div>

                                <span
                                    className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(
                                        booking.status
                                    )}`}
                                >
                                    {booking.status}
                                </span>

                            </div>

                            {/* Details */}

                            <div className="mt-6 grid gap-6 md:grid-cols-4">

                                <div className="flex gap-3">

                                    <CalendarDays
                                        size={19}
                                        className="mt-1 text-gray-400"
                                    />

                                    <div>

                                        <p className="text-xs text-gray-500">
                                            Pickup
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-gray-900">
                                            {booking.startDateTime.replace(
                                                "T",
                                                " "
                                            )}
                                        </p>

                                    </div>

                                </div>

                                <div className="flex gap-3">

                                    <Clock
                                        size={19}
                                        className="mt-1 text-gray-400"
                                    />

                                    <div>

                                        <p className="text-xs text-gray-500">
                                            Return
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-gray-900">
                                            {booking.endDateTime.replace(
                                                "T",
                                                " "
                                            )}
                                        </p>

                                    </div>

                                </div>

                                <div className="flex gap-3">

                                    <MapPin
                                        size={19}
                                        className="mt-1 text-gray-400"
                                    />

                                    <div>

                                        <p className="text-xs text-gray-500">
                                            Pickup option
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-gray-900">
                                            {booking.pickupType ===
                                            "SHOP_PICKUP"
                                                ? "Shop Pickup"
                                                : "Delivery"}
                                        </p>

                                    </div>

                                </div>

                                <div>

                                    <p className="text-xs text-gray-500">
                                        Total price
                                    </p>

                                    <p className="mt-1 text-xl font-bold text-gray-900">
                                        ₹{booking.totalPrice}
                                    </p>

                                </div>

                            </div>

                            {/* Actions */}

                            <div className="mt-6 flex flex-wrap gap-3 border-t pt-5">

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/partner/bookings/${booking.id}`
                                        )
                                    }
                                    className="rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-800"
                                >
                                    View Booking
                                </button>

                                {booking.status === "PENDING" && (

                                    <button
                                        onClick={() =>
                                            updateBookingStatus(
                                                booking.id,
                                                "confirm"
                                            )
                                        }
                                        disabled={
                                            updatingId ===
                                            booking.id
                                        }
                                        className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {updatingId === booking.id
                                            ? "Updating..."
                                            : "Confirm Booking"}
                                    </button>

                                )}

                                {booking.status === "CONFIRMED" && (

                                    <button
                                        onClick={() =>
                                            updateBookingStatus(
                                                booking.id,
                                                "activate"
                                            )
                                        }
                                        disabled={
                                            updatingId ===
                                            booking.id
                                        }
                                        className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {updatingId === booking.id
                                            ? "Updating..."
                                            : "Activate Booking"}
                                    </button>

                                )}

                                {booking.status === "ACTIVE" && (

                                    <button
                                        onClick={() =>
                                            updateBookingStatus(
                                                booking.id,
                                                "complete"
                                            )
                                        }
                                        disabled={
                                            updatingId ===
                                            booking.id
                                        }
                                        className="rounded-xl bg-gray-700 px-6 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                                    >
                                        {updatingId === booking.id
                                            ? "Updating..."
                                            : "Complete Booking"}
                                    </button>

                                )}

                            </div>

                        </div>

                    ))}

                </div>

            </main>

        </div>
    );
}

export default PartnerBookings;