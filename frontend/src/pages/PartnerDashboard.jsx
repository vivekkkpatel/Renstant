import { useEffect, useState } from "react";
import {
    Store,
    Car,
    CalendarDays,
    Clock,
    MapPin,
    ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getMyShop, getPartnerVehicles } from "../services/partnerService";
import { getPartnerBookings } from "../services/partnerBookingService";

function PartnerDashboard() {

    const navigate = useNavigate();

    const [shop, setShop] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const [shopData, vehicleData, bookingData] =
                    await Promise.all([
                        getMyShop(),
                        getPartnerVehicles(),
                        getPartnerBookings(),
                    ]);

                setShop(shopData);
                setVehicles(vehicleData);
                setBookings(bookingData);

            } catch (err) {

                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load dashboard."
                );

            } finally {

                setLoading(false);

            }
        };

        loadDashboard();

    }, []);

    const pendingBookings =
        bookings.filter(
            (booking) => booking.status === "PENDING"
        ).length;

    const confirmedBookings =
        bookings.filter(
            (booking) => booking.status === "CONFIRMED"
        ).length;

    const activeBookings =
        bookings.filter(
            (booking) => booking.status === "ACTIVE"
        ).length;

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
                    Loading dashboard...
                </p>

            </div>
        );
    }

    if (error) {

        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">

                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                    {error}
                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}

            <div className="border-b bg-white">

                <div className="mx-auto max-w-6xl px-6 py-8">

                    <p className="text-sm font-medium text-gray-500">
                        Partner Dashboard
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-gray-900">
                        Welcome back, {shop?.ownerName}
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage your rental business from one place.
                    </p>

                </div>

            </div>

            <main className="mx-auto max-w-6xl px-6 py-8">

                {/* Shop */}

                <div className="rounded-3xl bg-white p-6 shadow-sm">

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-start gap-4">

                            <div className="rounded-2xl bg-gray-100 p-3">
                                <Store size={25} />
                            </div>

                            <div>

                                <h2 className="text-xl font-bold text-gray-900">
                                    {shop?.name}
                                </h2>

                                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                    <MapPin size={16} />
                                    {shop?.city}, {shop?.state}
                                </div>

                            </div>

                        </div>

                        <span
                            className={`rounded-full px-4 py-2 text-sm font-semibold ${
                                shop?.active
                                    ? "bg-green-50 text-green-700"
                                    : "bg-red-50 text-red-700"
                            }`}
                        >
                            {shop?.active ? "Active" : "Inactive"}
                        </span>

                    </div>

                </div>

                {/* Stats */}

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <div className="rounded-2xl bg-white p-6 shadow-sm">

                        <Car
                            size={22}
                            className="text-gray-500"
                        />

                        <p className="mt-4 text-sm text-gray-500">
                            Vehicles
                        </p>

                        <p className="mt-1 text-3xl font-bold text-gray-900">
                            {vehicles.length}
                        </p>

                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">

                        <CalendarDays
                            size={22}
                            className="text-gray-500"
                        />

                        <p className="mt-4 text-sm text-gray-500">
                            Total Bookings
                        </p>

                        <p className="mt-1 text-3xl font-bold text-gray-900">
                            {bookings.length}
                        </p>

                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">

                        <Clock
                            size={22}
                            className="text-gray-500"
                        />

                        <p className="mt-4 text-sm text-gray-500">
                            Pending
                        </p>

                        <p className="mt-1 text-3xl font-bold text-gray-900">
                            {pendingBookings}
                        </p>

                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">

                        <CalendarDays
                            size={22}
                            className="text-gray-500"
                        />

                        <p className="mt-4 text-sm text-gray-500">
                            Active Rentals
                        </p>

                        <p className="mt-1 text-3xl font-bold text-gray-900">
                            {activeBookings}
                        </p>

                    </div>

                </div>

                {/* Vehicles */}

                <div className="mt-8">

                    <div className="flex items-center justify-between">

                        <div>

                            <h2 className="text-2xl font-bold text-gray-900">
                                My Vehicles
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Vehicles listed in your shop.
                            </p>

                        </div>

                        <button
                            onClick={() =>
                                navigate("/partner/vehicles")
                            }
                            className="hidden items-center gap-2 text-sm font-semibold text-gray-900 sm:flex"
                        >
                            Manage Vehicles
                            <ArrowRight size={16} />
                        </button>

                    </div>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">

                        {vehicles.map((vehicle) => (

                            <div
                                key={vehicle.id}
                                className="rounded-3xl bg-white p-6 shadow-sm"
                            >

                                <div className="flex items-start justify-between">

                                    <div>

                                        <h3 className="text-xl font-bold text-gray-900">
                                            {vehicle.name}
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {vehicle.brand} • {vehicle.model}
                                        </p>

                                    </div>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                            vehicle.active
                                                ? "bg-green-50 text-green-700"
                                                : "bg-red-50 text-red-700"
                                        }`}
                                    >
                                        {vehicle.active
                                            ? "Active"
                                            : "Inactive"}
                                    </span>

                                </div>

                                <div className="mt-6">

                                    <p className="text-sm text-gray-500">
                                        Price per day
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-gray-900">
                                        ₹{vehicle.pricePerDay}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                    <button
                        onClick={() =>
                            navigate("/partner/vehicles")
                        }
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 font-semibold text-gray-700 sm:hidden"
                    >
                        Manage Vehicles
                        <ArrowRight size={16} />
                    </button>

                </div>

                {/* Recent Bookings */}

                <div className="mt-10">

                    <div className="flex items-center justify-between">

                        <div>

                            <h2 className="text-2xl font-bold text-gray-900">
                                Recent Bookings
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Latest activity from your customers.
                            </p>

                        </div>

                        <button
                            onClick={() =>
                                navigate("/partner/bookings")
                            }
                            className="hidden items-center gap-2 text-sm font-semibold text-gray-900 sm:flex"
                        >
                            Manage Bookings
                            <ArrowRight size={16} />
                        </button>

                    </div>

                    <div className="mt-5 space-y-4">

                        {bookings.slice(0, 5).map((booking) => (

                            <div
                                key={booking.id}
                                className="rounded-2xl bg-white p-5 shadow-sm"
                            >

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Booking #{booking.id}
                                        </p>

                                        <h3 className="mt-1 font-bold text-gray-900">
                                            {booking.vehicleName}
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {booking.startDateTime.replace(
                                                "T",
                                                " "
                                            )}
                                            {" → "}
                                            {booking.endDateTime.replace(
                                                "T",
                                                " "
                                            )}
                                        </p>

                                    </div>

                                    <div className="flex items-center gap-4">

                                        <span className="font-semibold text-gray-900">
                                            ₹{booking.totalPrice}
                                        </span>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                                                booking.status
                                            )}`}
                                        >
                                            {booking.status}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                    <button
                        onClick={() =>
                            navigate("/partner/bookings")
                        }
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 font-semibold text-gray-700 sm:hidden"
                    >
                        Manage Bookings
                        <ArrowRight size={16} />
                    </button>

                </div>

            </main>

        </div>
    );
}

export default PartnerDashboard;