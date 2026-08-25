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
    fullName: string;          // backend sends fullName, frontend AuthUser needs firstName + lastName
    roles: string[];           // backend sends array, frontend AuthUser uses single role
    tenantId: string | null;
    tenantName: string | null; // populated for TenantAdmin users from JWT claims
    applicationId: string | null;
  };
}

// ─── Map backend response → frontend AuthResponse shape ────────────────────────────
function mapToAuthResponse(raw: BackendLoginResponse): AuthResponse {
  const [firstName = '', ...rest] = (raw.user.fullName ?? '').split(' ');
  const lastName = rest.join(' ');

  // Map backend role strings → frontend UserRole enum.
  // Backend seeds two accepted aliases for the top-level admin role:
  //   'GlobalAdmin'  (current seeder — DatabaseSeeder.cs)
  //   'SuperAdmin'   (future / alternative naming)
  const rawRole = (raw.user.roles?.[0] ?? 'User').toLowerCase();
  const role =
    rawRole === 'superadmin'  ? 'SUPER_ADMIN'  as const :
    rawRole === 'globaladmin' ? 'SUPER_ADMIN'  as const :
    rawRole === 'tenantadmin' ? 'TENANT_ADMIN' as const :
                                'USER'         as const;

  const user: AuthUser = {
    id:         raw.user.userId,
    email:      raw.user.email,
    firstName,
    lastName,
    role,
    tenantId:   raw.user.tenantId   ?? undefined,
    tenantName: raw.user.tenantName ?? undefined, // fix: was missing — TenantAdmin shell used 'My Tenant' fallback
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
    token:        raw.accessToken,
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

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await authClient.post<BackendLoginResponse>('/auth/login', credentials);
    localStorage.setItem('auth_token',    data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    return mapToAuthResponse(data);
  },

  async refresh(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    const { data } = await authClient.post<BackendLoginResponse>('/auth/refresh', { refreshToken });
    localStorage.setItem('auth_token',    data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    return { token: data.accessToken, refreshToken: data.refreshToken };
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token') ?? '';
    try {
      await authClient.post('/auth/logout', { refreshToken });
    } catch (err) {
      console.warn('Logout endpoint error:', extractMessage(err as AxiosError));
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  },
};

export type { AuthResponse, LoginCredentials };
