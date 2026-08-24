import { UserRole, UserPermissions } from '../../../types/auth';

export interface RoleDefinition {
  id: string;
  name: string;
  roleKey: UserRole;
  description: string;
  permissionsCount: number;
  assignedUsersCount: number;
  permissions: UserPermissions;
}

export const MOCK_ROLES: RoleDefinition[] = [
  {
    id: 'rol_super_admin',
    name: 'Super Administrator',
    roleKey: 'SUPER_ADMIN',
    description: 'Full system control across all tenants, applications, providers, and settings.',
    permissionsCount: 8,
    assignedUsersCount: 2,
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
  },
  {
    id: 'rol_tenant_admin',
    name: 'Tenant Administrator',
    roleKey: 'TENANT_ADMIN',
    description: 'Manages applications, team users, notification channels, and providers within their tenant workspace.',
    permissionsCount: 6,
    assignedUsersCount: 14,
    permissions: {
      canManageTenants: false,
      canManageApplications: true,
      canManageUsers: true,
      canManageRoles: false,
      canConfigureProviders: true,
      canSendNotifications: true,
      canViewHistory: true,
      canViewAnalytics: true,
    },
  },
  {
    id: 'rol_standard_user',
    name: 'Standard Operator',
    roleKey: 'USER',
    description: 'Can trigger notification dispatches, view notification history, and inspect logs.',
    permissionsCount: 2,
    assignedUsersCount: 45,
    permissions: {
      canManageTenants: false,
      canManageApplications: false,
      canManageUsers: false,
      canManageRoles: false,
      canConfigureProviders: false,
      canSendNotifications: true,
      canViewHistory: true,
      canViewAnalytics: false,
    },
  },
];

export const rolesApi = {
  getRoles: async (): Promise<RoleDefinition[]> => {
    await new Promise((r) => setTimeout(r, 200));
    return MOCK_ROLES;
  },
};
