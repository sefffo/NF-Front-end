import axios, { AxiosError } from 'axios';
import type { AuthUser, AuthResponse, LoginCredentials } from '../../../types/auth';

// ─── Unauthenticated axios client ───────────────────────────────────────────────────────
const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
});

// ─── Raw backend shapes (mirror LoginResponse.cs) ───────────────────────────────
interface BackendLoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    userId: string;
    email: string;
    fullName: string;      // backend sends fullName, frontend AuthUser needs firstName + lastName
    roles: string[];       // backend sends array, frontend AuthUser uses single role
    tenantId: string | null;
    applicationId: string | null;
  };
}

// ─── Map backend response → frontend AuthResponse shape ────────────────────────────
// AuthResponse.token is what providers.tsx reads as res.token
// AuthUser.role is what RoleGuard & DashboardRoleRouter read
function mapToAuthResponse(raw: BackendLoginResponse): AuthResponse {
  const [firstName = '', ...rest] = (raw.user.fullName ?? '').split(' ');
  const lastName = rest.join(' ');

  // Map backend role strings to frontend UserRole enum
  // Backend: 'SuperAdmin' | 'TenantAdmin' | 'User'  →  Frontend: 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'USER'
  const rawRole = (raw.user.roles?.[0] ?? 'User').toLowerCase();
  const role =
    rawRole === 'superadmin'  ? 'SUPER_ADMIN'  as const :
    rawRole === 'tenantadmin' ? 'TENANT_ADMIN' as const :
                                'USER'         as const;

  const user: AuthUser = {
    id:         raw.user.userId,
    email:      raw.user.email,
    firstName,
    lastName,
    role,
    tenantId:   raw.user.tenantId   ?? undefined,
    permissions: {
      canManageTenants:       role === 'SUPER_ADMIN',
      canManageApplications:  role !== 'USER',
      canManageUsers:         role !== 'USER',
      canManageRoles:         role === 'SUPER_ADMIN',
      canConfigureProviders:  role !== 'USER',
      canSendNotifications:   true,
      canViewHistory:         true,
      canViewAnalytics:       role !== 'USER',
    },
  };

  return {
    token:        raw.accessToken,   // ← providers.tsx reads res.token
    refreshToken: raw.refreshToken,
    user,
  };
}

function extractMessage(err: AxiosError): string {
  const rd = err.response?.data as Record<string, unknown> | undefined;
  return (
    (rd?.['detail'] as string) ??
    (rd?.['title']  as string) ??
    err.message ??
    'Unknown error'
  );
}

// ─── authApi object — exported as named export to match providers.tsx import shape ───────
// providers.tsx does: import { authApi } from '...' and calls authApi.login(credentials)
export const authApi = {
  /**
   * POST /api/auth/login
   * Stores accessToken as 'auth_token' (key the axios interceptor reads)
   * and refreshToken as 'refresh_token'.
   * Returns AuthResponse so providers.tsx can do: res.token, res.user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await authClient.post<BackendLoginResponse>('/auth/login', credentials);
    // Store tokens for the shared axios interceptor
    localStorage.setItem('auth_token',    data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    const mapped = mapToAuthResponse(data);
    return mapped;
  },

  /**
   * POST /api/auth/refresh
   * Rotates both tokens in localStorage.
   */
  async refresh(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    const { data } = await authClient.post<BackendLoginResponse>('/auth/refresh', { refreshToken });
    localStorage.setItem('auth_token',    data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    return { token: data.accessToken, refreshToken: data.refreshToken };
  },

  /**
   * POST /api/auth/logout
   * Always clears localStorage even if the server call fails.
   */
  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token') ?? '';
    try {
      await authClient.post('/auth/logout', { refreshToken });
    } catch (err) {
      // Swallow — we still clear local state
      console.warn('Logout endpoint error:', extractMessage(err as AxiosError));
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  },
};

// ─── Also export individual types for consumers that need them ──────────────────────
export type { AuthResponse, LoginCredentials };
