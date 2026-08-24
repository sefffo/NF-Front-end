import { LoginCredentials, AuthResponse, AuthUser } from '../../../types/auth';

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

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Simulated delay
    await new Promise((r) => setTimeout(r, 600));

    let role: AuthUser['role'] = 'SUPER_ADMIN';
    if (credentials.email.includes('tenant')) role = 'TENANT_ADMIN';
    if (credentials.email.includes('user')) role = 'USER';

    const user: AuthUser = {
      ...MOCK_USER,
      email: credentials.email,
      role,
    };

    return {
      token: 'mock_jwt_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
      user,
    };
  },

  getCurrentUser: async (): Promise<AuthUser> => {
    return MOCK_USER;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('auth_token');
  },
};
