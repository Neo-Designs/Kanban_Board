/**
 * Assigned to: Udeshi (Client API Services & Automated Testing)
 * Description: Client API service for authentication, sessions, and profile management.
 */
import { apiClient } from './client.js';

export const authApi = {
  async register(userData) {
    const data = await apiClient.post('/auth/register', userData);
    if (data.token) {
      localStorage.setItem('syncboard-token', data.token);
      localStorage.setItem('syncboard-logged-in', 'true');
      localStorage.setItem('syncboard-user', JSON.stringify(data.user));
    }
    return data;
  },

  async login(credentials) {
    const data = await apiClient.post('/auth/login', credentials);
    if (data.token) {
      localStorage.setItem('syncboard-token', data.token);
      localStorage.setItem('syncboard-logged-in', 'true');
      localStorage.setItem('syncboard-user', JSON.stringify(data.user));
    }
    return data;
  },

  async getMe() {
    const data = await apiClient.get('/auth/me');
    if (data.user) {
      localStorage.setItem('syncboard-user', JSON.stringify(data.user));
    }
    return data.user;
  },

  async updateProfile(profileData) {
    const data = await apiClient.put('/users/profile', profileData);
    if (data.user) {
      localStorage.setItem('syncboard-user', JSON.stringify(data.user));
    }
    return data.user;
  },

  async getStats() {
    return apiClient.get('/users/stats');
  },

  logout() {
    localStorage.removeItem('syncboard-token');
    localStorage.removeItem('syncboard-logged-in');
    localStorage.removeItem('syncboard-user');
    localStorage.removeItem('syncboard-profile');
  },

  getCurrentUser() {
    try {
      const raw = localStorage.getItem('syncboard-user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  isLoggedIn() {
    return Boolean(localStorage.getItem('syncboard-token'));
  },
};

export default authApi;
