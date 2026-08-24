import React, { createContext, useState, useEffect } from 'react';
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
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Load tenants when user is authenticated
    if (user) {
      tenantsApi.getTenants().then((data) => {
        setTenants(data);
        if (data.length > 0) setActiveTenant(data[0]);
      });
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
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  const refreshTenants = async () => {
    const data = await tenantsApi.getTenants();
    setTenants(data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        switchRole,
      }}
    >
      <TenantContext.Provider value={{ activeTenant, tenants, setActiveTenant, refreshTenants }}>
        {children}
      </TenantContext.Provider>
    </AuthContext.Provider>
  );
};
