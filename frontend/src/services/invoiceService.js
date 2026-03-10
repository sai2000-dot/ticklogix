import API from './api';

export const fetchInvoices    = ()           => API.get('/invoices');
export const fetchInvoiceById = (id)         => API.get(`/invoices/${id}`);
export const createInvoice    = (data)       => API.post('/invoices', data);
export const updateStatus     = (id, status) => API.patch(`/invoices/${id}/status`, { status });