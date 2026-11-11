import api from "./api";
export const uploadAttachments = (ticketId, files, commentId) => { const form = new FormData(); files.forEach((file) => form.append("files", file.originFileObj || file)); if (commentId) form.append("commentId", commentId); return api.post(`/tickets/${ticketId}/attachments`, form); };
export const uploadAttachment = (ticketId, file, commentId) => uploadAttachments(ticketId, [file], commentId);
export const getAttachments = (ticketId) => api.get(`/tickets/${ticketId}/attachments`);
export const downloadAttachment = (id) => api.get(`/attachments/${id}/download`, { responseType: "blob" });
