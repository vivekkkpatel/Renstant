import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import VehicleCard from "../components/VehicleCard";

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
    <VehicleCard
        key={vehicle.vehicleId}
        vehicle={vehicle}
        start={searchParams.get("start")}
        end={searchParams.get("end")}
    />
))}
          </div>
        )}
      </main>
    </div>
  );
}

export default SearchResults;
