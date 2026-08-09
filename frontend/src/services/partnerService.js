import api from "./api";

export const getMyShop = async () => {
    const response = await api.get("/shops/my-shop");
    return response.data;
};

export const getPartnerVehicles = async () => {
    const response = await api.get("/partner/vehicles");
    return response.data;
};

export const getVehicleUnits = async (vehicleId) => {
    const response = await api.get(
        `/partner/vehicles/${vehicleId}/units`
    );

    return response.data;
};

export const updateVehicleUnitStatus = async (unitId, status) => {
    const response = await api.patch(
        `/partner/units/${unitId}/status`,
        { status }
    );

    return response.data;
};

export const updateVehicle = async (vehicleId, data) => {
    const response = await api.patch(
        `/partner/vehicles/${vehicleId}`,
        data
    );

    return response.data;
};