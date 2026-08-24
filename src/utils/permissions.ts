import { UserRole, UserPermissions } from '../types/auth';

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  SUPER_ADMIN: {
    canManageTenants: true,
    canManageApplications: true,
    canManageUsers: true,
    canManageRoles: true,
    canConfigureProviders: true,
    canSendNotifications: true,
    canViewHistory: true,
    canViewAnalytics: true,
  },
  TENANT_ADMIN: {
    canManageTenants: false,
    canManageApplications: true,
    canManageUsers: true,
    canManageRoles: false,
    canConfigureProviders: true,
    canSendNotifications: true,
    canViewHistory: true,
    canViewAnalytics: true,
  },
  USER: {
    canManageTenants: false,
    canManageApplications: false,
    canManageUsers: false,
    canManageRoles: false,
    canConfigureProviders: false,
    canSendNotifications: true,
    canViewHistory: true,
    canViewAnalytics: false,
  },
};

export function hasPermission(role: UserRole | undefined, permission: keyof UserPermissions): boolean {
  if (!role) return false;
  const perms = DEFAULT_ROLE_PERMISSIONS[role];
  return perms ? perms[permission] : false;
}

export function isSuperAdmin(role: UserRole | undefined): boolean {
  return role === 'SUPER_ADMIN';
}

export function isTenantAdmin(role: UserRole | undefined): boolean {
  return role === 'TENANT_ADMIN' || role === 'SUPER_ADMIN';
}
