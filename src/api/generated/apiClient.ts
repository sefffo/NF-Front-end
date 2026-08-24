import api from '../axios';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export const apiClient = {
  get: async <T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> => {
    const res = await api.get<ApiResponse<T>>(url, { params });
    return res.data;
  },
  post: async <T>(url: string, data?: unknown): Promise<ApiResponse<T>> => {
    const res = await api.post<ApiResponse<T>>(url, data);
    return res.data;
  },
  put: async <T>(url: string, data?: unknown): Promise<ApiResponse<T>> => {
    const res = await api.put<ApiResponse<T>>(url, data);
    return res.data;
  },
  delete: async <T>(url: string): Promise<ApiResponse<T>> => {
    const res = await api.delete<ApiResponse<T>>(url);
    return res.data;
  },
};
