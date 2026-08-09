import api from "./api";

export const createBooking = async ({
    vehicleId,
    startDateTime,
    endDateTime,
    pickupType,
    deliveryAddress,
}) => {

    const response = await api.post("/bookings", {
        vehicleId,
        startDateTime,
        endDateTime,
        pickupType,
        deliveryAddress:
            pickupType === "DELIVERY"
                ? deliveryAddress
                : null,
    });

    return response.data;
};

export const getMyBookings = async () => {
    const response = await api.get("/bookings");
    return response.data;
};

export const getBookingById = async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
};

export const cancelBooking = async (bookingId) => {
    const response = await api.patch(
        `/bookings/${bookingId}/cancel`
    );

    return response.data;
};