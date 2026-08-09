import api from "./api";

export const getPartnerBookings = async () => {
    const response = await api.get("/partner/bookings");
    return response.data;
};

export const getPartnerBooking = async (bookingId) => {
    const response = await api.get(`/partner/bookings/${bookingId}`);
    return response.data;
};

export const confirmBooking = async (bookingId) => {
    const response = await api.patch(
        `/partner/bookings/${bookingId}/confirm`
    );
    return response.data;
};

export const activateBooking = async (bookingId) => {
    const response = await api.patch(
        `/partner/bookings/${bookingId}/activate`
    );
    return response.data;
};

export const completeBooking = async (bookingId) => {
    const response = await api.patch(
        `/partner/bookings/${bookingId}/complete`
    );
    return response.data;
};