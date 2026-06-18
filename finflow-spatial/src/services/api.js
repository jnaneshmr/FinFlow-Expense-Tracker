// src/services/api.js
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor — unwrap data, handle auth errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ff_user');
      localStorage.removeItem('ff_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ────────────────────────────────────────────
export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};

// ── Transactions ────────────────────────────────────
export const transactionService = {
  getAll: (params) => api.get('/transactions', { params }),
  getOne: (id) => api.get(`/transactions/${id}`),
  getSummary: (params) => api.get('/transactions/summary', { params }),
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
};

// ── Subscriptions ───────────────────────────────────
export const subscriptionService = {
  getAll: (params) => api.get('/subscriptions', { params }),
  getOne: (id) => api.get(`/subscriptions/${id}`),
  getUpcoming: (days) => api.get('/subscriptions/upcoming', { params: { days } }),
  create: (data) => api.post('/subscriptions', data),
  update: (id, data) => api.put(`/subscriptions/${id}`, data),
  delete: (id) => api.delete(`/subscriptions/${id}`),
};

// ── Budgets ─────────────────────────────────────────
export const budgetService = {
  getAll: (params) => api.get('/budgets', { params }),
  create: (data) => api.post('/budgets', data),
  update: (id, data) => api.put(`/budgets/${id}`, data),
  delete: (id) => api.delete(`/budgets/${id}`),
};

// ── Dashboard ───────────────────────────────────────
export const dashboardService = {
  getSummary: () => api.get('/dashboard/summary'),
};

// ── Users ───────────────────────────────────────────
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/password', data),
  getNotifications: () => api.get('/users/notifications'),
  markRead: (id) => api.put(`/users/notifications/${id}/read`),
};
