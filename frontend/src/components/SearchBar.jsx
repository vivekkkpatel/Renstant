import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CalendarDays, Clock, Search } from "lucide-react";

function SearchBar() {
    const [location, setLocation] = useState("");
    const [pickupDate, setPickupDate] = useState("");
    const [pickupTime, setPickupTime] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [returnTime, setReturnTime] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
    e.preventDefault();

    if (returnDate < pickupDate ||
        (returnDate === pickupDate && returnTime <= pickupTime)) {
        alert("Return date and time must be after pickup date and time.");
        return;
    }

    const start = `${pickupDate}T${pickupTime}:00`;
    const end = `${returnDate}T${returnTime}:00`;

    const params = new URLSearchParams({
        city: location.trim(),
        start,
        end,
    });

    if (vehicleType) {
        params.set("type", vehicleType);
    }

    navigate(`/search?${params.toString()}`);
};

    return (
        <form
            onSubmit={handleSearch}
            className="relative z-10 mx-auto -mt-12 max-w-7xl rounded-2xl bg-white p-5 shadow-xl"
        >
            <div className="grid gap-4 lg:grid-cols-8">

                {/* Location */}
                <div className="lg:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Location
                    </label>

                    <div className="relative">
                        <MapPin
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Where are you going?"
                            value={location}
                            onChange={(e) =>
                                setLocation(e.target.value)
                            }
                            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-gray-900"
                            required
                        />
                    </div>
                </div>

                {/* Pickup */}
                <div className="lg:col-span-2">
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
                                value={pickupDate}
                                onChange={(e) =>
                                    setPickupDate(e.target.value)
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
                                value={pickupTime}
                                onChange={(e) =>
                                    setPickupTime(e.target.value)
                                }
                                className="w-full rounded-xl border border-gray-200 py-3 pl-9 pr-2 text-sm outline-none focus:border-gray-900"
                                required
                            />
                        </div>

                    </div>
                </div>

                {/* Return */}
                <div className="lg:col-span-2">
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
                                value={returnDate}
                                onChange={(e) =>
                                    setReturnDate(e.target.value)
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
                                value={returnTime}
                                onChange={(e) =>
                                    setReturnTime(e.target.value)
                                }
                                className="w-full rounded-xl border border-gray-200 py-3 pl-9 pr-2 text-sm outline-none focus:border-gray-900"
                                required
                            />
                        </div>

                    </div>
                </div>

                {/* Vehicle Type */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Vehicle Type
                    </label>

                    <select
                        value={vehicleType}
                        onChange={(e) =>
                            setVehicleType(e.target.value)
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-gray-900"
                    >
                        <option value="">All vehicles</option>
                        <option value="BIKE">Bike</option>
                        <option value="SCOOTER">Scooter</option>
                        <option value="CAR">Car</option>
                    </select>
                </div>

                {/* Search */}
                <div className="flex items-end">
                    <button
                        type="submit"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 font-medium text-white transition hover:bg-gray-800"
                    >
                        <Search size={18} />
                        Search
                    </button>
                </div>

            </div>
        </form>
    );
}

export default SearchBar;