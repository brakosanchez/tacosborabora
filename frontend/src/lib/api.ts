import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  },
  register: async (userData: { email: string; password: string; name: string }) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  },
  logout: async () => {
    const response = await axios.post(`${API_URL}/auth/logout`);
    return response.data;
  },
  getSession: async () => {
    const response = await axios.get(`${API_URL}/auth/session`);
    return response.data;
  },
};

export const orderApi = {
  createOrder: async (orderData: any) => {
    const response = await axios.post(`${API_URL}/orders`, orderData);
    return response.data;
  },
  getOrders: async () => {
    const response = await axios.get(`${API_URL}/orders`);
    return response.data;
  },
  getOrder: async (id: string) => {
    const response = await axios.get(`${API_URL}/orders/${id}`);
    return response.data;
  },
  updateOrderStatus: async (id: string, status: string) => {
    const response = await axios.patch(`${API_URL}/orders/${id}/status`, { status });
    return response.data;
  },
};

export const productApi = {
  getProducts: async () => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  },
  getProduct: async (id: string) => {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  },
};

export const api = {
  ...authApi,
  ...orderApi,
  ...productApi,
};

export default api;
