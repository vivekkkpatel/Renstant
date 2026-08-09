import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Car,
    ChevronDown,
    ChevronUp,
    Wrench,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
    getPartnerVehicles,
    getVehicleUnits,
    updateVehicleUnitStatus,
} from "../services/partnerService";

function PartnerVehicles() {

    const navigate = useNavigate();

    const [vehicles, setVehicles] = useState([]);
    const [units, setUnits] = useState({});
    const [expandedVehicle, setExpandedVehicle] = useState(null);

    const [loading, setLoading] = useState(true);
    const [unitLoading, setUnitLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadVehicles = async () => {

            try {

                const data = await getPartnerVehicles();

                setVehicles(data);

            } catch (err) {

                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load vehicles."
                );

            } finally {

                setLoading(false);

            }
        };

        loadVehicles();

    }, []);

    const toggleUnits = async (vehicleId) => {

        if (expandedVehicle === vehicleId) {

            setExpandedVehicle(null);
            return;
        }

        setExpandedVehicle(vehicleId);

        if (units[vehicleId]) {
            return;
        }

        try {

            setUnitLoading(true);

            const data = await getVehicleUnits(vehicleId);

            setUnits((previous) => ({
                ...previous,
                [vehicleId]: data,
            }));

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load vehicle units."
            );

        } finally {

            setUnitLoading(false);

        }
    };

    const changeUnitStatus = async (unitId, status, vehicleId) => {

        try {

            const updatedUnit =
                await updateVehicleUnitStatus(
                    unitId,
                    status
                );

            setUnits((previous) => ({
                ...previous,
                [vehicleId]: previous[vehicleId].map(
                    (unit) =>
                        unit.id === unitId
                            ? updatedUnit
                            : unit
                ),
            }));

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Unable to update unit status."
            );
        }
    };

    const getStatusClass = (status) => {

        switch (status) {

            case "AVAILABLE":
                return "bg-green-50 text-green-700";

            case "MAINTENANCE":
                return "bg-orange-50 text-orange-700";

            case "UNAVAILABLE":
                return "bg-red-50 text-red-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    if (loading) {

        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">

                <p className="text-gray-500">
                    Loading vehicles...
                </p>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}

            <div className="border-b bg-white">

                <div className="mx-auto max-w-6xl px-6 py-8">

                    <button
                        onClick={() =>
                            navigate("/partner/dashboard")
                        }
                        className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
                    >
                        <ArrowLeft size={17} />
                        Back to dashboard
                    </button>

                    <p className="text-sm font-medium text-gray-500">
                        Partner Fleet
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-gray-900">
                        My Vehicles
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage your listed vehicles and their physical units.
                    </p>

                </div>

            </div>

            <main className="mx-auto max-w-6xl px-6 py-8">

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                        {error}
                    </div>
                )}

                {vehicles.length === 0 ? (

                    <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

                        <Car
                            size={40}
                            className="mx-auto text-gray-400"
                        />

                        <h2 className="mt-4 text-xl font-bold text-gray-900">
                            No vehicles yet
                        </h2>

                        <p className="mt-2 text-gray-500">
                            You haven't listed any vehicles.
                        </p>

                    </div>

                ) : (

                    <div className="space-y-5">

                        {vehicles.map((vehicle) => {

                            const vehicleUnits =
                                units[vehicle.id] || [];

                            const availableUnits =
                                vehicleUnits.filter(
                                    (unit) =>
                                        unit.status === "AVAILABLE"
                                ).length;

                            const maintenanceUnits =
                                vehicleUnits.filter(
                                    (unit) =>
                                        unit.status === "MAINTENANCE"
                                ).length;

                            const isExpanded =
                                expandedVehicle === vehicle.id;

                            return (
                                <div
                                    key={vehicle.id}
                                    className="overflow-hidden rounded-3xl bg-white shadow-sm"
                                >

                                    {/* Vehicle */}

                                    <div className="p-6">

                                        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                                            <div className="flex items-start gap-4">

                                                <div className="rounded-2xl bg-gray-100 p-3">
                                                    <Car size={25} />
                                                </div>

                                                <div>

                                                    <div className="flex flex-wrap items-center gap-3">

                                                        <h2 className="text-xl font-bold text-gray-900">
                                                            {vehicle.name}
                                                        </h2>

                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                                vehicle.active
                                                                    ? "bg-green-50 text-green-700"
                                                                    : "bg-red-50 text-red-700"
                                                            }`}
                                                        >
                                                            {vehicle.active
                                                                ? "ACTIVE"
                                                                : "INACTIVE"}
                                                        </span>

                                                    </div>

                                                    <p className="mt-1 text-gray-500">
                                                        {vehicle.brand} • {vehicle.model}
                                                    </p>

                                                    <p className="mt-3 text-2xl font-bold text-gray-900">
                                                        ₹{vehicle.pricePerDay}
                                                        <span className="ml-1 text-sm font-normal text-gray-500">
                                                            /day
                                                        </span>
                                                    </p>

                                                </div>

                                            </div>

                                            <button
                                                onClick={() =>
                                                    toggleUnits(vehicle.id)
                                                }
                                                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                                            >
                                                {isExpanded
                                                    ? "Hide Units"
                                                    : "Manage Units"}

                                                {isExpanded
                                                    ? <ChevronUp size={18} />
                                                    : <ChevronDown size={18} />
                                                }
                                            </button>

                                        </div>

                                        {/* Unit summary */}

                                        {isExpanded && (
                                            <div className="mt-6 grid gap-3 border-t pt-5 sm:grid-cols-3">

                                                <div className="rounded-xl bg-gray-50 p-4">

                                                    <p className="text-sm text-gray-500">
                                                        Total Units
                                                    </p>

                                                    <p className="mt-1 text-2xl font-bold">
                                                        {vehicleUnits.length}
                                                    </p>

                                                </div>

                                                <div className="rounded-xl bg-green-50 p-4">

                                                    <p className="text-sm text-green-700">
                                                        Available
                                                    </p>

                                                    <p className="mt-1 text-2xl font-bold text-green-700">
                                                        {availableUnits}
                                                    </p>

                                                </div>

                                                <div className="rounded-xl bg-orange-50 p-4">

                                                    <p className="text-sm text-orange-700">
                                                        Maintenance
                                                    </p>

                                                    <p className="mt-1 text-2xl font-bold text-orange-700">
                                                        {maintenanceUnits}
                                                    </p>

                                                </div>

                                            </div>
                                        )}

                                    </div>

                                    {/* Units */}

                                    {isExpanded && (

                                        <div className="border-t bg-gray-50 px-6 py-6">

                                            {unitLoading ? (

                                                <p className="text-center text-gray-500">
                                                    Loading units...
                                                </p>

                                            ) : (

                                                <div className="space-y-3">

                                                    {vehicleUnits.map(
                                                        (unit) => (

                                                            <div
                                                                key={unit.id}
                                                                className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                                                            >

                                                                <div>

                                                                    <div className="flex items-center gap-3">

                                                                        <p className="font-semibold text-gray-900">
                                                                            Unit #{unit.id}
                                                                        </p>

                                                                        <span
                                                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                                                                                unit.status
                                                                            )}`}
                                                                        >
                                                                            {unit.status}
                                                                        </span>

                                                                    </div>

                                                                    <p className="mt-1 text-sm text-gray-500">
                                                                        Registration:{" "}
                                                                        {unit.registrationNumber}
                                                                    </p>

                                                                </div>

                                                                <div className="flex items-center gap-2">

                                                                    {unit.status ===
                                                                        "AVAILABLE" && (

                                                                        <button
                                                                            onClick={() =>
                                                                                changeUnitStatus(
                                                                                    unit.id,
                                                                                    "MAINTENANCE",
                                                                                    vehicle.id
                                                                                )
                                                                            }
                                                                            className="flex items-center gap-2 rounded-xl border border-orange-200 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50"
                                                                        >
                                                                            <Wrench
                                                                                size={16}
                                                                            />
                                                                            Maintenance
                                                                        </button>

                                                                    )}

                                                                    {unit.status ===
                                                                        "MAINTENANCE" && (

                                                                        <button
                                                                            onClick={() =>
                                                                                changeUnitStatus(
                                                                                    unit.id,
                                                                                    "AVAILABLE",
                                                                                    vehicle.id
                                                                                )
                                                                            }
                                                                            className="rounded-xl border border-green-200 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
                                                                        >
                                                                            Mark Available
                                                                        </button>

                                                                    )}

                                                                </div>

                                                            </div>

                                                        )
                                                    )}

                                                </div>
                                            )}

                                        </div>
                                    )}

                                </div>
                            );
                        })}

                    </div>
                )}

            </main>

        </div>
    );
}

export default PartnerVehicles;