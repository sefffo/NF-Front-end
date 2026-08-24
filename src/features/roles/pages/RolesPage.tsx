import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Table, Column } from '../../../components/common/Table';
import { RoleDefinition, rolesApi } from '../api/rolesApi';
import { Check, X } from 'lucide-react';

export const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    rolesApi.getRoles().then((data) => {
      setRoles(data);
      setIsLoading(false);
    });
  }, []);

  const columns: Column<RoleDefinition>[] = [
    {
      key: 'name',
      header: 'Role Name',
      render: (r) => (
        <div>
          <strong className="text-brand">{r.name}</strong>
          <div className="text-muted text-xs">{r.description}</div>
        </div>
      ),
    },
    {
      key: 'roleKey',
      header: 'Role Key',
      render: (r) => <code>{r.roleKey}</code>,
    },
    {
      key: 'permissions',
      header: 'Key Capabilities',
      render: (r) => (
        <div className="permissions-pills">
          {r.permissions.canManageTenants && <span className="perm-pill">Tenants</span>}
          {r.permissions.canManageApplications && <span className="perm-pill">Apps</span>}
          {r.permissions.canConfigureProviders && <span className="perm-pill">Providers</span>}
          {r.permissions.canSendNotifications && <span className="perm-pill">Dispatch</span>}
        </div>
      ),
    },
    {
      key: 'assignedUsersCount',
      header: 'Active Users',
      render: (r) => <span>{r.assignedUsersCount} Users</span>,
    },
  ];

  return (
    <div className="page-container-inner">
      <PageHeader title="Roles & Permissions Matrix" subtitle="View and audit Role-Based Access Control (RBAC) rules" />

      <div className="card">
        <Table columns={columns} data={roles} keyExtractor={(r) => r.id} isLoading={isLoading} />
      </div>
    </div>
  );
};
