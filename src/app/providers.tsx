<<<<<<< HEAD
import React, { createContext, useState, useEffect, useContext } from 'react';
=======
import React, { createContext, useState, useEffect } from 'react';
>>>>>>> develop
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

<<<<<<< HEAD
export const AuthContext   = createContext<AuthContextType | undefined>(undefined);
export const TenantContext = createContext<TenantContextType | undefined>(undefined);

// Build a minimal Tenant shell from JWT claims.
// Used for TenantAdmin so ApplicationsPage always has a tenantId immediately.
function buildTenantShellFromUser(user: AuthUser): Tenant | null {
  if (!user.tenantId) return null;
  return {
    id:     user.tenantId,
    name:   user.tenantName ?? user.email,
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
  const [user, setUser]                 = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading]       = useState<boolean>(true);
  const [tenants, setTenants]           = useState<Tenant[]>([]);
  const [activeTenant, setActiveTenant] = useState<Tenant | null>(null);

  // ── Session restore on page refresh ─────────────────────────────────────────
  // fix: was only restoring user but never rebuilding activeTenant, so
  // ApplicationsPage showed "no tenant" banner on every refresh.
  useEffect(() => {
    const token     = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    if (token && savedUser) {
      try {
        const restoredUser: AuthUser = JSON.parse(savedUser);
        setUser(restoredUser);
        // Immediately rebuild tenant state from the saved user so pages that
        // depend on activeTenant don't flash an error on refresh.
        if (restoredUser.role === 'TENANT_ADMIN') {
          const shell = buildTenantShellFromUser(restoredUser);
          if (shell) {
            setActiveTenant(shell);
            setTenants([shell]);
          }
        }
        // GlobalAdmin: tenantsApi.getTenants() will be called by the second
        // useEffect once user state is set — no extra work needed here.
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
=======
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // true on mount while we check storage
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [activeTenant, setActiveTenant] = useState<Tenant | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('auth_token');
>>>>>>> develop
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

<<<<<<< HEAD
  // ── Load tenants after login (or after session restore for GlobalAdmin) ──────
  useEffect(() => {
    if (!user) return;

    if (user.role === 'SUPER_ADMIN') {
      tenantsApi
        .getTenants()
        .then((data) => {
          setTenants(data);
          if (data.length > 0 && !activeTenant) setActiveTenant(data[0]);
        })
        .catch((err) => {
          console.error('[AppProviders] Failed to load tenants:', err);
        });
    } else if (user.role === 'TENANT_ADMIN') {
      // TenantAdmin: getTenants() returns 403 — use JWT claims directly.
      // Session restore already called buildTenantShellFromUser, but we also
      // handle the fresh-login path here.
      const shell = buildTenantShellFromUser(user);
      if (shell && !activeTenant) {
        setActiveTenant(shell);
        setTenants([shell]);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
=======
  useEffect(() => {
    // Load tenants when user is authenticated
    if (user) {
      tenantsApi.getTenants().then((data) => {
        setTenants(data);
        if (data.length > 0) setActiveTenant(data[0]);
      });
    }
>>>>>>> develop
  }, [user]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
<<<<<<< HEAD
      // authApi.login() now saves auth_token, refresh_token, and auth_user
      // to localStorage before returning, so we just consume the result.
      const res = await authApi.login(credentials);
      setUser(res.user);
=======
      const res = await authApi.login(credentials);
      setUser(res.user);
      localStorage.setItem('auth_token', res.token);
      localStorage.setItem('auth_user', JSON.stringify(res.user));
>>>>>>> develop
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
<<<<<<< HEAD
    // authApi.logout() removes all three localStorage keys
    authApi.logout();
=======
    authApi.logout();
    localStorage.removeItem('auth_user');
>>>>>>> develop
    setUser(null);
    setTenants([]);
    setActiveTenant(null);
  };

  const switchRole = (newRole: AuthUser['role']) => {
<<<<<<< HEAD
    if (user) setUser({ ...user, role: newRole });
  };

  const refreshTenants = async () => {
    if (!user) return;
    if (user.role === 'SUPER_ADMIN') {
      const data = await tenantsApi.getTenants();
      setTenants(data);
    }
    // TenantAdmin has exactly one tenant — nothing to refresh
=======
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  const refreshTenants = async () => {
    const data = await tenantsApi.getTenants();
    setTenants(data);
>>>>>>> develop
  };

  return (
    <AuthContext.Provider
<<<<<<< HEAD
      value={{ user, isAuthenticated: !!user, isLoading, login, logout, switchRole }}
=======
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        switchRole,
      }}
>>>>>>> develop
    >
      <TenantContext.Provider value={{ activeTenant, tenants, setActiveTenant, refreshTenants }}>
        {children}
      </TenantContext.Provider>
    </AuthContext.Provider>
  );
};
<<<<<<< HEAD

// ─── Convenience hooks ────────────────────────────────────────────────────────
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
=======
>>>>>>> develop
