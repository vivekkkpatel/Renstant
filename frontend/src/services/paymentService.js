import api from "./api";

export const createPaymentOrder = async (bookingId) => {
    const response = await api.post(
        `/payments/create-order/${bookingId}`
    );

    return response.data;
};

export const verifyPayment = async ({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
}) => {
    const response = await api.post("/payments/verify", {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
    });

    return response.data;
};