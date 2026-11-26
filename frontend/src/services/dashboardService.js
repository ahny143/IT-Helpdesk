import api from "./api";

export const getEmployeeDashboard = () => api.get("/dashboard/employee");
