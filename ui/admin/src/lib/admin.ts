import { get, post } from './api';

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await post<{
      success: boolean;
      message: string;
      data: any;
    }>('/admin/login', {
      email,
      password
    });
    return res.data;
  },

  me: async () => {
    const res = await get<{
      success: boolean;
      message: string;
      data: any;
    }>('/admin/me');
    return res.data;
  }
};

export const adminApi = {
  getAnalytics: async () => {
    const res = await get<{
      success: boolean;
      message: string;
      data: any;
    }>('/admin/analytics');
    return res.data;
  },
  getDashboard: async () => {
    const res = await get<{
      success: boolean;
      message: string;
      data: any;
    }>('/admin/dashboard');
    return res.data;
  }
};
