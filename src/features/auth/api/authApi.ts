<<<<<<< HEAD
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
  };
}

// ─── Decode JWT payload (base64url → JSON) without a library ─────────────────
function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}

// ─── Map backend response → frontend AuthResponse ────────────────────────────
function mapToAuthResponse(raw: BackendLoginResponse): AuthResponse {
  const [firstName = '', ...rest] = (raw.user.fullName ?? '').trim().split(' ');
  const lastName = rest.join(' ');

  // Backend sends "GlobalAdmin" | "TenantAdmin" | "User" — normalise to frontend enum
  const rawRole = (raw.user.roles?.[0] ?? 'User').toLowerCase();
  const role: AuthUser['role'] =
    rawRole === 'globaladmin' ? 'SUPER_ADMIN'  :
    rawRole === 'superadmin'  ? 'SUPER_ADMIN'  :
    rawRole === 'tenantadmin' ? 'TENANT_ADMIN' :
                                'USER';

  // tenantName is NOT in the response body — decode JWT to find it
  const jwtPayload  = decodeJwtPayload(raw.accessToken);
  const tenantName  =
    (jwtPayload['tenantName']  as string | undefined) ??
    (jwtPayload['tenant_name'] as string | undefined) ??
    undefined;

  const tenantId      = raw.user.tenantId      ?? undefined;
  const applicationId = raw.user.applicationId ?? undefined;

  const user: AuthUser = {
    id:         raw.user.userId,
    email:      raw.user.email,
    firstName,
    lastName,
    role,
    tenantId,
    tenantName,
    applicationId,    // fix: now populated from backend response
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
    const mapped = mapToAuthResponse(data);
    // Persist both token and full user object so session restore works on page refresh
    localStorage.setItem('auth_token',    data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    localStorage.setItem('auth_user',     JSON.stringify(mapped.user));
    return mapped;
  },

  async refresh(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    const { data } = await authClient.post<BackendLoginResponse>('/auth/refresh', { refreshToken });
    const mapped = mapToAuthResponse(data);
    localStorage.setItem('auth_token',    data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    localStorage.setItem('auth_user',     JSON.stringify(mapped.user));
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
      localStorage.removeItem('auth_user');
    }
  },
};

export type { AuthResponse, LoginCredentials };
=======
import { LoginCredentials, AuthResponse, AuthUser } from '../../../types/auth';
import api from '../../../api/axios';

// Mock initial super admin user for demo/scaffold
export const MOCK_USER: AuthUser = {
  id: 'usr_super_1',
  email: 'admin@notifications.io',
  firstName: 'Alexander',
  lastName: 'Vance',
  role: 'SUPER_ADMIN',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  permissions: {
    canManageTenants: true,
    canManageApplications: true,
    canManageUsers: true,
    canManageRoles: true,
    canConfigureProviders: true,
    canSendNotifications: true,
    canViewHistory: true,
    canViewAnalytics: true,
  },
};

interface ApiAuthUser {
  userId: string;
  email: string;
  fullName: string;
  roles: string[];
  tenantId?: string | null;
}

interface ApiLoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: ApiAuthUser;
}

// Task 96: map backend role names onto the FE role union
const mapRole = (roles: string[]): AuthUser['role'] => {
  if (roles.includes('GlobalAdmin')) return 'SUPER_ADMIN';
  if (roles.includes('TenantAdmin')) return 'TENANT_ADMIN';
  return 'USER';
};

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Task 96: real backend login (POST /api/auth/login), was mocked
    const { data } = await api.post<ApiLoginResponse>('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });

    const [firstName = '', ...lastNameParts] = data.user.fullName.split(' ');
    const isSuperAdmin = data.user.roles.includes('GlobalAdmin');

    const user: AuthUser = {
      id: data.user.userId,
      email: data.user.email,
      firstName,
      lastName: lastNameParts.join(' '),
      role: mapRole(data.user.roles),
      tenantId: data.user.tenantId ?? undefined,
      permissions: {
        canManageTenants: isSuperAdmin,
        canManageApplications: isSuperAdmin,
        canManageUsers: isSuperAdmin,
        canManageRoles: isSuperAdmin,
        canConfigureProviders: isSuperAdmin,
        canSendNotifications: isSuperAdmin,
        canViewHistory: isSuperAdmin,
        canViewAnalytics: isSuperAdmin,
      },
    };

    return {
      token: data.accessToken,
      refreshToken: data.refreshToken,
      user,
    };
  },

  getCurrentUser: async (): Promise<AuthUser> => {
    // Task 96: session is restored from localStorage by AppProviders until an
    // /auth/me endpoint exists on the backend
    return MOCK_USER;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('auth_token');
  },
};
>>>>>>> develop
