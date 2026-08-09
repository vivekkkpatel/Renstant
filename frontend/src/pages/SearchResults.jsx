import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MapPin, Star } from "lucide-react";

import { searchVehicles } from "../services/vehicleService";

function SearchResults() {
  const [searchParams] = useSearchParams();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await searchVehicles({
          city: searchParams.get("city"),
          start: searchParams.get("start"),
          end: searchParams.get("end"),
          type: searchParams.get("type") || undefined,
        });

        setVehicles(data);
      } catch (err) {
        console.error(err);

        setError(err.response?.data?.message || "Unable to find vehicles.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Available vehicles
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {searchParams.get("city")} ·{" "}
            {searchParams.get("start")?.replace("T", " ")}
            {" → "}
            {searchParams.get("end")?.replace("T", " ")}
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {loading && (
          <div className="py-20 text-center">
            <p className="text-gray-500">Finding available vehicles...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && vehicles.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              No vehicles found
            </h2>

            <p className="mt-2 text-gray-500">
              Try changing your location, dates or vehicle type.
            </p>
          </div>
        )}

        {!loading && !error && vehicles.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.vehicleId}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Image */}
                <div className="flex h-52 items-center justify-center bg-gray-100">
                  {vehicle.imageUrl ? (
                    <img
                      src={vehicle.imageUrl}
                      alt={vehicle.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm text-gray-400">
                      No image available
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {vehicle.name}
                      </h2>

                      <p className="text-sm text-gray-500">
                        {vehicle.brand} · {vehicle.model}
                      </p>
                    </div>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                      {vehicle.type}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="mt-4 flex items-center gap-1 text-sm">
                    <Star size={16} className="fill-current" />

                    <span>{vehicle.rating?.toFixed(1)}</span>
                  </div>

                  {/* Shop */}
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={16} />

                    <span>
                      {vehicle.shopName}, {vehicle.city}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{vehicle.pricePerDay}
                      </span>

                      <span className="text-sm text-gray-500">/day</span>
                    </div>

                    <span className="text-xs text-green-600">
                      {vehicle.availableUnits} available
                    </span>
                  </div>

                  <button
                    onClick={() => {
    const params = new URLSearchParams();

    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (start) params.set("start", start);
    if (end) params.set("end", end);

    navigate(
        `/vehicles/${vehicle.vehicleId}?${params.toString()}`
    );
}}
                    className="mt-5 w-full rounded-xl bg-gray-900 py-3 font-medium text-white transition hover:bg-gray-800"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default SearchResults;
