import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/api/auth/signup', data),
  login: (data) => api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me'),
  updateWallet: (walletAddress) => api.put('/api/auth/wallet', { walletAddress }),
  updateDID: (did) => api.put('/api/auth/did', { did }),
};

// Credential APIs
export const credentialAPI = {
  issueCredential: (data) => api.post('/api/credentials/issue', data),
  getMyCredentials: () => api.get('/api/credentials/my'),
  getCredentialByHash: (hash) => api.get(`/api/credentials/${hash}`),
  revokeCredential: (id) => api.put(`/api/credentials/${id}/revoke`),
  getStudents: () => api.get('/api/credentials/students'),
};

export default api;
