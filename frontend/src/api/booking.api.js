import api from "./axios.js";

export const getAllBookings = (params) => api.get('/bookings', { params });
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const createBooking = (data) => api.post('/bookings', data);
export const updateBooking = (id, data) => api.patch(`/bookings/${id}`, data);
export const updateBookingStatus = (id, data) => api.patch(`/bookings/${id}/status`, data);
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);