import { useEffect, useState } from "react";
import {
    CalendarDays,
    Clock,
    MapPin,
    ShieldCheck,
} from "lucide-react";
import {
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

import { getVehicleById } from "../services/vehicleService";
import { createBooking } from "../services/bookingService";

function BookingPage() {

    const { vehicleId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [vehicle, setVehicle] = useState(null);

    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");

    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");

    const [pickupType, setPickupType] =
        useState("SHOP_PICKUP");

    const [deliveryAddress, setDeliveryAddress] =
        useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadVehicle = async () => {

            try {

                const data =
                    await getVehicleById(vehicleId);

                setVehicle(data);

                const start =
                    searchParams.get("start");

                const end =
                    searchParams.get("end");

                if (start) {
                    const [date, time] =
                        start.split("T");

                    setStartDate(date);
                    setStartTime(time.slice(0, 5));
                }

                if (end) {
                    const [date, time] =
                        end.split("T");

                    setEndDate(date);
                    setEndTime(time.slice(0, 5));
                }

            } catch (err) {

                console.error(err);

                setError(
                    "Unable to load vehicle details."
                );

            } finally {

                setLoading(false);

            }
        };

        loadVehicle();

    }, [vehicleId, searchParams]);

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        const startDateTime =
            `${startDate}T${startTime}:00`;

        const endDateTime =
            `${endDate}T${endTime}:00`;

        if (
            !startDate ||
            !startTime ||
            !endDate ||
            !endTime
        ) {
            setError(
                "Please select pickup and return date/time."
            );

            return;
        }

        if (
            new Date(endDateTime) <=
            new Date(startDateTime)
        ) {
            setError(
                "Return date and time must be after pickup date and time."
            );

            return;
        }

        if (
            pickupType === "DELIVERY" &&
            !deliveryAddress.trim()
        ) {
            setError(
                "Please enter the delivery address."
            );

            return;
        }

        try {

            setSubmitting(true);

            const booking =
                await createBooking({
                    vehicleId: Number(vehicleId),
                    startDateTime,
                    endDateTime,
                    pickupType,
                    deliveryAddress,
                });

            navigate(
                `/bookings/${booking.id}`,
                {
                    state: {
                        booking,
                    },
                }
            );

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to create booking."
            );

        } finally {

            setSubmitting(false);

        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-gray-500">
                    Loading booking details...
                </p>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="mx-auto max-w-3xl rounded-2xl bg-red-50 p-6 text-red-700">
                    {error || "Vehicle not found."}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="border-b bg-white">
                <div className="mx-auto max-w-6xl px-6 py-5">

                    <button
                        onClick={() => navigate(-1)}
                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        ← Back to vehicle
                    </button>

                </div>
            </div>

            <main className="mx-auto max-w-6xl px-6 py-10">

                <div className="grid gap-8 lg:grid-cols-3">

                    {/* Booking form */}

                    <form
                        onSubmit={handleSubmit}
                        className="lg:col-span-2 rounded-3xl bg-white p-8 shadow-sm"
                    >

                        <h1 className="text-3xl font-bold text-gray-900">
                            Book {vehicle.name}
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Choose your rental period and pickup option.
                        </p>

                        {error && (
                            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {/* Dates */}

                        <div className="mt-8">

                            <h2 className="font-semibold text-gray-900">
                                Rental period
                            </h2>

                            <div className="mt-4 grid gap-5 md:grid-cols-2">

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Pickup
                                    </label>

                                    <div className="grid grid-cols-2 gap-2">

                                        <div className="relative">
                                            <CalendarDays
                                                size={16}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            />

                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) =>
                                                    setStartDate(e.target.value)
                                                }
                                                className="w-full rounded-xl border border-gray-200 py-3 pl-9 pr-2 text-sm outline-none focus:border-gray-900"
                                                required
                                            />
                                        </div>

                                        <div className="relative">
                                            <Clock
                                                size={16}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            />

                                            <input
                                                type="time"
                                                value={startTime}
                                                onChange={(e) =>
                                                    setStartTime(e.target.value)
                                                }
                                                className="w-full rounded-xl border border-gray-200 py-3 pl-9 pr-2 text-sm outline-none focus:border-gray-900"
                                                required
                                            />
                                        </div>

                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Return
                                    </label>

                                    <div className="grid grid-cols-2 gap-2">

                                        <div className="relative">
                                            <CalendarDays
                                                size={16}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            />

                                            <input
                                                type="date"
                                                value={endDate}
                                                onChange={(e) =>
                                                    setEndDate(e.target.value)
                                                }
                                                className="w-full rounded-xl border border-gray-200 py-3 pl-9 pr-2 text-sm outline-none focus:border-gray-900"
                                                required
                                            />
                                        </div>

                                        <div className="relative">
                                            <Clock
                                                size={16}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            />

                                            <input
                                                type="time"
                                                value={endTime}
                                                onChange={(e) =>
                                                    setEndTime(e.target.value)
                                                }
                                                className="w-full rounded-xl border border-gray-200 py-3 pl-9 pr-2 text-sm outline-none focus:border-gray-900"
                                                required
                                            />
                                        </div>

                                    </div>
                                </div>

                            </div>

                        </div>

                        {/* Pickup type */}

                        <div className="mt-8">

                            <h2 className="font-semibold text-gray-900">
                                Pickup option
                            </h2>

                            <div className="mt-4 grid gap-4 md:grid-cols-2">

                                <label className="cursor-pointer rounded-2xl border p-5 hover:border-gray-900">

                                    <input
                                        type="radio"
                                        name="pickupType"
                                        value="SHOP_PICKUP"
                                        checked={
                                            pickupType ===
                                            "SHOP_PICKUP"
                                        }
                                        onChange={(e) =>
                                            setPickupType(
                                                e.target.value
                                            )
                                        }
                                        className="mr-3"
                                    />

                                    <span className="font-medium">
                                        Shop Pickup
                                    </span>

                                    <p className="mt-2 pl-6 text-sm text-gray-500">
                                        Pick up the vehicle from {vehicle.shopName}.
                                    </p>

                                </label>

                                <label className="cursor-pointer rounded-2xl border p-5 hover:border-gray-900">

                                    <input
                                        type="radio"
                                        name="pickupType"
                                        value="DELIVERY"
                                        checked={
                                            pickupType ===
                                            "DELIVERY"
                                        }
                                        onChange={(e) =>
                                            setPickupType(
                                                e.target.value
                                            )
                                        }
                                        className="mr-3"
                                    />

                                    <span className="font-medium">
                                        Delivery
                                    </span>

                                    <p className="mt-2 pl-6 text-sm text-gray-500">
                                        Get the vehicle delivered to your address.
                                    </p>

                                </label>

                            </div>

                        </div>

                        {/* Delivery address */}

                        {pickupType === "DELIVERY" && (

                            <div className="mt-6">

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Delivery address
                                </label>

                                <textarea
                                    value={deliveryAddress}
                                    onChange={(e) =>
                                        setDeliveryAddress(
                                            e.target.value
                                        )
                                    }
                                    rows="3"
                                    placeholder="Enter your complete delivery address"
                                    className="w-full resize-none rounded-xl border border-gray-200 p-4 text-sm outline-none focus:border-gray-900"
                                />

                            </div>

                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-8 w-full rounded-xl bg-gray-900 py-4 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting
                                ? "Creating booking..."
                                : "Confirm Booking"}
                        </button>

                    </form>

                    {/* Summary */}

                    <div className="h-fit rounded-3xl bg-white p-6 shadow-sm">

                        <h2 className="text-lg font-semibold text-gray-900">
                            Booking summary
                        </h2>

                        <div className="mt-6">

                            <h3 className="text-xl font-bold">
                                {vehicle.name}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                {vehicle.brand} · {vehicle.model}
                            </p>

                        </div>

                        <div className="mt-6 space-y-4 border-t pt-6">

                            <div className="flex gap-3">

                                <CalendarDays
                                    size={18}
                                    className="text-gray-400"
                                />

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Rental period
                                    </p>

                                    <p className="text-sm font-medium">
                                        {startDate || "—"}
                                        {" → "}
                                        {endDate || "—"}
                                    </p>
                                </div>

                            </div>

                            <div className="flex gap-3">

                                <Clock
                                    size={18}
                                    className="text-gray-400"
                                />

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Time
                                    </p>

                                    <p className="text-sm font-medium">
                                        {startTime || "—"}
                                        {" → "}
                                        {endTime || "—"}
                                    </p>
                                </div>

                            </div>

                            <div className="flex gap-3">

                                <MapPin
                                    size={18}
                                    className="text-gray-400"
                                />

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Pickup
                                    </p>

                                    <p className="text-sm font-medium">
                                        {pickupType ===
                                        "SHOP_PICKUP"
                                            ? vehicle.shopName
                                            : "Delivery"}
                                    </p>
                                </div>

                            </div>

                        </div>

                        <div className="mt-6 border-t pt-6">

                            <div className="flex items-center justify-between">

                                <span className="text-gray-500">
                                    Price per day
                                </span>

                                <span className="font-semibold">
                                    ₹{vehicle.pricePerDay}
                                </span>

                            </div>

                            <div className="mt-3 flex items-center justify-between">

                                <span className="text-gray-500">
                                    Security deposit
                                </span>

                                <span className="font-semibold">
                                    ₹{vehicle.securityDeposit}
                                </span>

                            </div>

                        </div>

                        <div className="mt-6 flex gap-2 rounded-xl bg-green-50 p-4 text-sm text-green-700">

                            <ShieldCheck size={18} />

                            <span>
                                Your booking will be confirmed only
                                if a vehicle unit is available.
                            </span>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default BookingPage;