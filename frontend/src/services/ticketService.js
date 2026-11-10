import api from "./api";
export const listTickets = (params) => api.get("/tickets", { params });
export const getTicket = (id) => api.get(`/tickets/${id}`);
export const createTicket = (data) => api.post("/tickets", data);
export const updateTicket = (id, data) => api.put(`/tickets/${id}`, data);
export const assignTicket = (id, assigneeId) => api.patch(`/tickets/${id}/assign`, { assigneeId });
export const changeTicketStatus = (id, data) => api.patch(`/tickets/${id}/status`, data);
export const getTicketHistory = (id) => api.get(`/tickets/${id}/history`);
