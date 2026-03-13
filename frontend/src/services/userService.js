import API from './api';
export const fetchUsers = ()         => API.get('/users');
export const fetchUser  = (id)       => API.get('/users/${id}');
export const updateUser = (id, data) => API.patch('/users/${id}', data);
