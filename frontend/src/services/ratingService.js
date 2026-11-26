import api from "./api";
export const submitRating = (ticketId, data) => api.post(`/tickets/${ticketId}/ratings`, data);
export const getTicketRating = (ticketId) => api.get(`/tickets/${ticketId}/ratings`);
export const getRatings = (params) => api.get("/ratings", { params });
export const getRatingStatistics = () => api.get("/ratings/statistics");
