import api from "./api";

export const searchVehicles = async ({
    city,
    start,
    end,
    type,
    minPrice,
    maxPrice,
}) => {

    const params = {
        city,
        start,
        end,
    };

    if (type) params.type = type;
    if (minPrice !== undefined && minPrice !== "")
        params.minPrice = minPrice;

    if (maxPrice !== undefined && maxPrice !== "")
        params.maxPrice = maxPrice;

    const response = await api.get(
        "/vehicles/search",
        { params }
    );

    return response.data;
};

export const searchNearbyVehicles = async ({
    latitude,
    longitude,
    radiusKm,
    start,
    end,
    type,
    minPrice,
    maxPrice,
}) => {

    const params = {
        latitude,
        longitude,
        radiusKm,
        start,
        end,
    };

    if (type) params.type = type;

    if (minPrice !== undefined && minPrice !== "")
        params.minPrice = minPrice;

    if (maxPrice !== undefined && maxPrice !== "")
        params.maxPrice = maxPrice;

    const response = await api.get(
        "/vehicles/search/nearby",
        { params }
    );

    return response.data;
};

export const getVehicleById = async (vehicleId) => {
    const response = await api.get(`/vehicles/${vehicleId}`);
    return response.data;
};