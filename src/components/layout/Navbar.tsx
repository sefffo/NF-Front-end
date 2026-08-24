import React, { useContext } from 'react';
import { Search, Building, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { TenantContext } from '../../app/providers';
import { UserRole } from '../../types/auth';

export const Navbar: React.FC = () => {
  const { user, switchRole } = useAuth();
  const tenantCtx = useContext(TenantContext);

  return (
    <header className="navbar">
      <div className="navbar-search">
        <Search size={16} className="search-icon" />
        <input type="text" placeholder="Search templates, logs, tenant IDs..." className="search-input" />
      </div>

      <div className="navbar-actions">
        {/* Tenant Selector */}
        {tenantCtx && tenantCtx.tenants.length > 0 && (
          <div className="tenant-selector">
            <Building size={16} className="tenant-icon" />
            <select
              className="tenant-select"
              value={tenantCtx.activeTenant?.id || ''}
              onChange={(e) => {
                const found = tenantCtx.tenants.find((t) => t.id === e.target.value);
                if (found) tenantCtx.setActiveTenant(found);
              }}
            >
              {tenantCtx.tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Demo Role Switcher */}
        <div className="role-switcher" title="Quick Role Switcher for Scaffolding Testing">
          <Shield size={14} />
          <select
            className="role-select"
            value={user?.role || 'SUPER_ADMIN'}
            onChange={(e) => switchRole(e.target.value as UserRole)}
          >
            <option value="SUPER_ADMIN">Role: Super Admin</option>
            <option value="TENANT_ADMIN">Role: Tenant Admin</option>
            <option value="USER">Role: User / Operator</option>
          </select>
        </div>
      </div>
    </header>
  );
};
