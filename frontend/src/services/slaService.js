import api from "./api";
export const listSlaConfigs = () => api.get("/sla/configs");
export const updateSlaConfig = (priority, resolutionMinutes) => api.put(`/sla/configs/${priority}`, { resolutionMinutes });
export const listHolidays = () => api.get("/sla/holidays");
export const createHoliday = (data) => api.post("/sla/holidays", data);
export const updateHoliday = (id, data) => api.put(`/sla/holidays/${id}`, data);
export const getTicketSla = (ticketId) => api.get(`/sla/tickets/${ticketId}`);
export const listSlaMonitoring = () => api.get("/sla/tickets");
export const getSlaReport = (params) => api.get("/sla/reports", { params });
