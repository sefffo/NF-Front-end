import axios, { AxiosError } from 'axios';
import type { AuthUser, AuthResponse, LoginCredentials } from '../../../types/auth';

// ─── Unauthenticated axios client ────────────────────────────────────────────
const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
});

// ─── Exact shape the backend /auth/login actually returns ────────────────────
// Verified from live response 2026-08-25:
// {
//   "accessToken": "...",
//   "refreshToken": "...",
//   "expiresIn": 3600,
//   "user": {
//     "userId": "...",
//     "email": "...",
//     "fullName": "...",
//     "roles": ["GlobalAdmin"],   <-- array of strings
//     "tenantId": null | "...",
//     "applicationId": null | "..."
//     // NOTE: NO tenantName field in response body
//   }
// }
interface BackendLoginResponse {
  accessToken:  string;
  refreshToken: string;
  expiresIn:    number;
  user: {
    userId:        string;
    email:         string;
    fullName:      string;
    roles:         string[];        // ["GlobalAdmin"] | ["TenantAdmin"] | ["User"]
    tenantId:      string | null;
    applicationId: string | null;
    // tenantName is NOT returned by the backend — extracted from JWT instead
  };
}

// ─── Decode JWT payload (base64url → JSON) without a library ────────────────
function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}

// ─── Map backend response → frontend AuthResponse ───────────────────────────
function mapToAuthResponse(raw: BackendLoginResponse): AuthResponse {
  // Split fullName → firstName + lastName
  const [firstName = '', ...rest] = (raw.user.fullName ?? '').trim().split(' ');
  const lastName = rest.join(' ');

  // Normalise role: backend sends "GlobalAdmin" | "TenantAdmin" | "User"
  const rawRole = (raw.user.roles?.[0] ?? 'User').toLowerCase();
  const role =
    rawRole === 'superadmin'  ? 'SUPER_ADMIN'  as const :
    rawRole === 'globaladmin' ? 'SUPER_ADMIN'  as const :
    rawRole === 'tenantadmin' ? 'TENANT_ADMIN' as const :
                                'USER'         as const;

  // tenantName is NOT in the response body — decode JWT to find it.
  // Backend embeds claim key "tenantName" (or similar) for TenantAdmin tokens.
  const jwtPayload = decodeJwtPayload(raw.accessToken);
  const tenantName =
    (jwtPayload['tenantName'] as string | undefined) ??
    (jwtPayload['tenant_name'] as string | undefined) ??
    undefined;

  const tenantId = raw.user.tenantId ?? undefined;

  const user: AuthUser = {
    id:         raw.user.userId,
    email:      raw.user.email,
    firstName,
    lastName,
    role,
    tenantId,
    tenantName,
    permissions: {
      canManageTenants:      role === 'SUPER_ADMIN',
      canManageApplications: role !== 'USER',
      canManageUsers:        role !== 'USER',
      canManageRoles:        role === 'SUPER_ADMIN',
      canConfigureProviders: role !== 'USER',
      canSendNotifications:  true,
      canViewHistory:        true,
      canViewAnalytics:      role !== 'USER',
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
    (rd?.['detail']  as string) ??
    (rd?.['title']   as string) ??
    (rd?.['message'] as string) ??
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
