import { useAuth } from './useAuth';
import { hasPermission, isSuperAdmin, isTenantAdmin } from '../utils/permissions';
import { UserPermissions } from '../types/auth';

export function usePermissions() {
  const { user } = useAuth();

  return {
    role: user?.role,
    isSuperAdmin: isSuperAdmin(user?.role),
    isTenantAdmin: isTenantAdmin(user?.role),
    can: (permission: keyof UserPermissions) => hasPermission(user?.role, permission),
  };
}
