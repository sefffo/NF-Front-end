import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Extend config to carry a _retry flag so we only retry once per request
interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ─── Request interceptor — attach Bearer token ──────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — on 401: refresh once, retry, THEN logout ─────────
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableConfig | undefined;

    // Only attempt refresh if:
    //  1. Response was 401
    //  2. We haven't already retried this exact request
    //  3. We have a refresh token stored
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        originalRequest._retry = true; // prevent infinite retry loop

        try {
          // Call refresh endpoint directly (no interceptors, avoids loop)
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL ?? '/api'}/auth/refresh`,
            { refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );

          const newToken = data.accessToken as string;
          const newRefresh = data.refreshToken as string;

          // Persist new tokens
          localStorage.setItem('auth_token', newToken);
          localStorage.setItem('refresh_token', newRefresh);

          // Retry the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return api(originalRequest);
        } catch {
          // Refresh itself failed (expired/revoked) — NOW we log out
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('auth_user');
          window.location.href = '/login';
          return Promise.reject(error);
        }
      }
    }

    // For all non-401 errors (or 401 with no refresh token), just reject
    return Promise.reject(error);
  }
);

export default api;
