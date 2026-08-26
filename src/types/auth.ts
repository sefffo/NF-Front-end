export type UserRole = 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'USER';

export interface UserPermissions {
  canManageTenants: boolean;
  canManageApplications: boolean;
  canManageUsers: boolean;
  canManageRoles: boolean;
  canConfigureProviders: boolean;
  canSendNotifications: boolean;
  canViewHistory: boolean;
  canViewAnalytics: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId?: string;
  tenantName?: string;
<<<<<<< HEAD
  applicationId?: string;   // fix: was missing — referenced by SendNotificationPage
=======
>>>>>>> develop
  avatarUrl?: string;
  permissions: UserPermissions;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: AuthUser;
}
