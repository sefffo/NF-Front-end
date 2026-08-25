import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthUser, LoginCredentials } from '../types/auth';
import { authApi } from '../features/auth/api/authApi';
import { Tenant } from '../types/tenant';
import { tenantsApi } from '../features/tenants/api/tenantsApi';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  switchRole: (role: AuthUser['role']) => void;
}

interface TenantContextType {
  activeTenant: Tenant | null;
  tenants: Tenant[];
  setActiveTenant: (tenant: Tenant | null) => void;
  refreshTenants: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const TenantContext = createContext<TenantContextType | undefined>(undefined);

// Build a minimal Tenant shell from JWT claims.
// Used for TenantAdmin so ApplicationsPage always has a tenantId available.
// tenantName is now correctly populated from the JWT (fixed in authApi.ts).
function buildTenantShellFromUser(user: AuthUser): Tenant | null {
  if (!user.tenantId) return null;
  return {
    id:     user.tenantId,
    name:   user.tenantName ?? user.email, // fix: fall back to email if tenantName still missing
    slug:   '',
    status: 'ACTIVE',
    apiKey: '',
    settings: {
      maxApplications:       0,
      maxDailyNotifications: 0,
      allowedChannels:       [],
    },
    applicationsCount: 0,
    usersCount:        0,
    createdAt:         '',
    updatedAt:         '',
  };
}

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser]                   = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading]         = useState<boolean>(true);
  const [tenants, setTenants]             = useState<Tenant[]>([]);
  const [activeTenant, setActiveTenant]   = useState<Tenant | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const token     = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!user) return;

    if (user.role === 'SUPER_ADMIN') {
      // GlobalAdmin: fetch all tenants and set first as active
      tenantsApi
        .getTenants()
        .then((data) => {
          setTenants(data);
          if (data.length > 0) setActiveTenant(data[0]);
        })
        .catch((err) => {
          // fix: was a silent swallow — log the error so it shows in devtools
          console.error('[AppProviders] Failed to load tenants on login:', err);
          // activeTenant stays null; ApplicationsPage shows a clear "select tenant" alert
        });
    } else if (user.role === 'TENANT_ADMIN') {
      // TenantAdmin: seed activeTenant from JWT claims immediately.
      // getTenants() returns 403 for TenantAdmin, so we never call it.
      const shell = buildTenantShellFromUser(user);
      if (shell) {
        setActiveTenant(shell);
        setTenants([shell]);
      }
    }
  }, [user]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(credentials);
      setUser(res.user);
      localStorage.setItem('auth_token', res.token);
      localStorage.setItem('auth_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    localStorage.removeItem('auth_user');
    setUser(null);
    setTenants([]);
    setActiveTenant(null);
  };

  const switchRole = (newRole: AuthUser['role']) => {
    if (user) setUser({ ...user, role: newRole });
  };

  const refreshTenants = async () => {
    if (!user) return;
    if (user.role === 'SUPER_ADMIN') {
      const data = await tenantsApi.getTenants();
      setTenants(data);
    }
    // TenantAdmin has exactly one tenant (themselves) — nothing to refresh
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout, switchRole }}
    >
      <TenantContext.Provider value={{ activeTenant, tenants, setActiveTenant, refreshTenants }}>
        {children}
      </TenantContext.Provider>
    </AuthContext.Provider>
  );
};

// ─── Convenience hooks ───────────────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AppProviders');
  return ctx;
};

export const useTenant = () => {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used inside AppProviders');
  return ctx;
};
