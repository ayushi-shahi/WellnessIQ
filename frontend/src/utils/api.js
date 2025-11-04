import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', new URLSearchParams(data)),
};

export const userAPI = {
  getMe: () => api.get('/users/me'),
  updateMe: (data) => api.put('/users/me', data),
  getAllUsers: () => api.get('/users'),
};

export const trackerAPI = {
  create: (data) => api.post('/trackers/', data),
  getAll: (params) => api.get('/trackers/', { params }),
  getById: (id) => api.get(`/trackers/${id}`),
  update: (id, data) => api.put(`/trackers/${id}`, data),
  delete: (id) => api.delete(`/trackers/${id}`),
};

export const goalAPI = {
  create: (data) => api.post('/goals/', data),
  getAll: () => api.get('/goals/'),
  getById: (id) => api.get(`/goals/${id}`),
  update: (id, data) => api.put(`/goals/${id}`, data),
  delete: (id) => api.delete(`/goals/${id}`),
};

export const analyticsAPI = {
  getProgress: (days = 30) => api.get(`/analytics/progress?days=${days}`),
  getWellnessScore: () => api.get('/analytics/wellness-score'),
  getAllUsersAnalytics: () => api.get('/analytics/admin/all-users'),
};

export const aiAPI = {
  generateInsight: () => api.post('/ai/insight'),
  chatWithAssistant: (message) => api.post('/ai/assistant', { message }),
  getInsights: (limit = 10) => api.get(`/ai/insights?limit=${limit}`),
};

export default api;
