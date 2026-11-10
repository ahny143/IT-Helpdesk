import api from "./api";
export const getProfile = () => api.get("/users/profile");
export const updateProfile = (data) => api.put("/users/profile", data);
export const listUsers = () => api.get("/users");
export const createUser = (data) => api.post("/users", data);
export const updateUserStatus = (id, isActive) => api.patch(`/users/${id}/status`, { isActive });
