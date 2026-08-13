import { MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

function VehicleCard({ vehicle, start, end, showAvailability = true }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    const params = new URLSearchParams();

    if (start) params.set("start", start);
    if (end) params.set("end", end);

    navigate(`/vehicles/${vehicle.vehicleId}?${params.toString()}`);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {/* Image */}
      <div className="flex h-52 items-center justify-center bg-gray-100">
        {vehicle.imageUrl ? (
          <img
            src={vehicle.imageUrl}
            alt={vehicle.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-sm text-gray-400">No image available</span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {vehicle.name}
            </h2>

            <p className="text-sm text-gray-500">
              {vehicle.brand} · {vehicle.model}
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
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

          <span>{vehicle.shopName}</span>
        </div>

        {/* Price */}
        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ₹{vehicle.pricePerDay}
            </span>

            <span className="text-sm text-gray-500">/day</span>
          </div>

          {showAvailability && vehicle.availableUnits !== undefined && (
            <span className="text-xs text-green-600">
              {vehicle.availableUnits} available
            </span>
          )}
        </div>

        {/* Button */}
        <button
          onClick={handleViewDetails}
          className="mt-5 w-full rounded-xl bg-gray-900 py-3 font-medium text-white transition hover:bg-gray-800"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default VehicleCard;
