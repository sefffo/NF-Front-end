import axios, { AxiosError } from 'axios';

// ─── POST /api/auth/login ─────────────────────────────────────────────────────────
// Mirrors LoginCommand.cs
export interface LoginCommand {
  email: string;
  password: string;
}

// Mirrors AuthenticatedUserResponse.cs
export interface AuthenticatedUserResponse {
  userId: string;
  email: string;
  fullName: string;
  roles: string[];
  tenantId: string | null;
  applicationId: string | null;
}

// Mirrors LoginResponse.cs
export interface LoginResponse {
  accessToken: string;   // ← stored as 'auth_token' for axios interceptor
  refreshToken: string;  // ← stored as 'refresh_token'
  expiresIn: number;     // seconds
  user: AuthenticatedUserResponse;
}

// ─── POST /api/auth/refresh ─────────────────────────────────────────────────────
export interface RefreshTokenCommand {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ─── POST /api/auth/logout ─────────────────────────────────────────────────────
export interface LogoutCommand {
  refreshToken: string;
}

// ─── Result wrapper ──────────────────────────────────────────────────────────────
export type AuthApiResult<T> =
  | { ok: true;  data: T }
  | { ok: false; status: number; message: string };

// ─── Unauthenticated axios client (no Bearer header) ────────────────────────────
const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
});

function extractMessage(err: AxiosError): { status: number; message: string } {
  const rd = err.response?.data as Record<string, unknown> | undefined;
  return {
    status: err.response?.status ?? 0,
    message:
      (rd?.['detail'] as string) ??
      (rd?.['title']  as string) ??
      err.message ??
      'Unknown error',
  };
}

// ─── login() ─────────────────────────────────────────────────────────────────────
// Stores accessToken as 'auth_token' — the key the axios interceptor reads.
// Stores refreshToken as 'refresh_token' for later token refresh calls.
export async function login(
  command: LoginCommand
): Promise<AuthApiResult<LoginResponse>> {
  try {
    const { data } = await authClient.post<LoginResponse>('/auth/login', command);
    localStorage.setItem('auth_token',    data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, ...extractMessage(err as AxiosError) };
  }
}

// ─── refreshToken() ───────────────────────────────────────────────────────────────
export async function refreshToken(
  command: RefreshTokenCommand
): Promise<AuthApiResult<RefreshTokenResponse>> {
  try {
    const { data } = await authClient.post<RefreshTokenResponse>('/auth/refresh', command);
    localStorage.setItem('auth_token',    data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, ...extractMessage(err as AxiosError) };
  }
}

// ─── logout() ─────────────────────────────────────────────────────────────────────
// Always clears local storage regardless of server response.
export async function logout(command: LogoutCommand): Promise<void> {
  try {
    await authClient.post('/auth/logout', command);
  } finally {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }
}
