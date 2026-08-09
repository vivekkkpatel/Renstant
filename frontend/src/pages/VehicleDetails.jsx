import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, MapPin, ShieldCheck, Star } from "lucide-react";

import { getVehicleById } from "../services/vehicleService";

function VehicleDetails() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);

        const data = await getVehicleById(vehicleId);

        setVehicle(data);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message || "Unable to load vehicle details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading vehicle...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-3xl rounded-2xl bg-red-50 p-6 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            Back to results
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image */}
          <div className="flex min-h-[420px] items-center justify-center overflow-hidden rounded-3xl bg-gray-100">
            {vehicle.imageUrl ? (
              <img
                src={vehicle.imageUrl}
                alt={vehicle.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-gray-400">No image available</span>
            )}
          </div>

          {/* Details */}
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-gray-400">
                  {vehicle.type}
                </p>

                <h1 className="mt-2 text-4xl font-bold text-gray-900">
                  {vehicle.name}
                </h1>

                <p className="mt-2 text-lg text-gray-500">
                  {vehicle.brand} · {vehicle.model}
                </p>
              </div>

              <div className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-2">
                <Star size={16} className="fill-current" />

                <span className="text-sm font-medium">
                  {vehicle.rating?.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Shop */}
            <div className="mt-8 flex items-center gap-3">
              <div className="rounded-full bg-gray-100 p-3">
                <MapPin size={20} />
              </div>

              <div>
                <p className="text-sm text-gray-500">Rental shop</p>

                <p className="font-semibold text-gray-900">
                  {vehicle.shopName}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="font-semibold text-gray-900">
                About this vehicle
              </h2>

              <p className="mt-2 leading-7 text-gray-600">
                {vehicle.description || "No description available."}
              </p>
            </div>

            {/* Pricing */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Rental price</p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  ₹{vehicle.pricePerDay}
                  <span className="text-sm font-normal text-gray-500">
                    {" "}
                    / day
                  </span>
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Security deposit</p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  ₹{vehicle.securityDeposit}
                </p>
              </div>
            </div>

            {/* Trust */}
            <div className="mt-6 flex items-center gap-2 text-sm text-green-700">
              <ShieldCheck size={18} />

              <span>Available for booking</span>
            </div>

            {/* Book */}
            <button
              onClick={() => {
                const params = new URLSearchParams();

                const start = searchParams.get("start");
                const end = searchParams.get("end");

                if (start) params.set("start", start);
                if (end) params.set("end", end);

                navigate(`/vehicles/${vehicle.id}/book?${params.toString()}`);
              }}
              className="mt-8 w-full rounded-xl bg-gray-900 py-4 text-lg font-semibold text-white transition hover:bg-gray-800"
            >
              Book This Vehicle
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default VehicleDetails;
