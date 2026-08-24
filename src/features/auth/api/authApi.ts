import axios from 'axios';

// ─── Login ───────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Body: { email: string; password: string }
// Response: LoginResponse (see LoginResponse.cs)
export interface LoginCommand {
  email: string;
  password: string;
}

export interface AuthenticatedUserResponse {
  userId: string;
  email: string;
  fullName: string;
  roles: string[];
  tenantId: string | null;
  applicationId: string | null;
}

export interface LoginResponse {
  accessToken: string;    // ← the JWT Bearer token
  refreshToken: string;
  expiresIn: number;      // seconds
  user: AuthenticatedUserResponse;
}

// ─── Refresh ─────────────────────────────────────────────────────────────────
// POST /api/auth/refresh
export interface RefreshTokenCommand {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ─── Logout ──────────────────────────────────────────────────────────────────
// POST /api/auth/logout
export interface LogoutCommand {
  refreshToken: string;
}

// ─── Plain axios (no Bearer header needed for auth endpoints) ─────────────────
const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export type AuthApiResult<T> =
  | { ok: true;  data: T }
  | { ok: false; status: number; message: string };

// ─── login() — stores accessToken as 'auth_token' for the axios interceptor ─
export async function login(command: LoginCommand): Promise<AuthApiResult<LoginResponse>> {
  try {
    const { data } = await authClient.post<LoginResponse>('/auth/login', command);
    // axios.ts interceptor reads 'auth_token' from localStorage
    localStorage.setItem('auth_token',    data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    return { ok: true, data };
  } catch (err: unknown) {
    const e = err as import('axios').AxiosError;
    const rd = e.response?.data as Record<string, unknown> | undefined;
    return {
      ok: false,
      status: e.response?.status ?? 0,
      message: (rd?.['detail'] as string) ?? (rd?.['title'] as string) ?? e.message,
    };
  }
}

// ─── refreshToken() ───────────────────────────────────────────────────────────
export async function refreshToken(
  command: RefreshTokenCommand
): Promise<AuthApiResult<RefreshTokenResponse>> {
  try {
    const { data } = await authClient.post<RefreshTokenResponse>('/auth/refresh', command);
    localStorage.setItem('auth_token',    data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    return { ok: true, data };
  } catch (err: unknown) {
    const e = err as import('axios').AxiosError;
    const rd = e.response?.data as Record<string, unknown> | undefined;
    return {
      ok: false,
      status: e.response?.status ?? 0,
      message: (rd?.['detail'] as string) ?? (rd?.['title'] as string) ?? e.message,
    };
  }
}

// ─── logout() ────────────────────────────────────────────────────────────────
export async function logout(command: LogoutCommand): Promise<void> {
  try {
    await authClient.post('/auth/logout', command);
  } finally {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }
}
