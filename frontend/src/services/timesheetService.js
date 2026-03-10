import API from './api';

export const fetchTimesheets  = ()           => API.get('/timesheets');
export const createTimesheet  = (data)       => API.post('/timesheets', data);
export const submitTimesheet  = (id)         => API.patch(`/timesheets/${id}/submit`);
export const approveTimesheet = (id)         => API.patch(`/timesheets/${id}/approve`);
export const rejectTimesheet  = (id, reason) => API.patch(`/timesheets/${id}/reject`, { reason });