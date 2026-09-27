import api from './client';

export const authApi = { login: (payload) => api.post('/auth/login', payload), me: () => api.get('/auth/me'), register: (payload) => api.post('/auth/register', payload) };
export const projectApi = {
  list: (params = {}) => api.get('/projects', { params }),
  get: (slug) => api.get(`/projects/${slug}`),
  create: (formData) => api.post('/projects', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/projects/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (id) => api.delete(`/projects/${id}`),
};
export const serviceApi = { list: () => api.get('/services'), create: (payload) => api.post('/services', payload), update: (id, payload) => api.put(`/services/${id}`, payload), remove: (id) => api.delete(`/services/${id}`) };
export const inquiryApi = { create: (payload) => api.post('/inquiries', payload), list: (params) => api.get('/inquiries', { params }), update: (id, payload) => api.patch(`/inquiries/${id}`, payload), remove: (id) => api.delete(`/inquiries/${id}`) };
export const testimonialApi = {
  list: () => api.get('/testimonials'),
  create: (formData) => api.post('/testimonials', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, payload) => api.put(`/testimonials/${id}`, payload),
  remove: (id) => api.delete(`/testimonials/${id}`),
};
export const statsApi = { dashboard: () => api.get('/stats/dashboard') };
