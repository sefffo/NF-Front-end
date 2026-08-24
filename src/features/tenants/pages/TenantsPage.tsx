import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Table, Column } from '../../../components/common/Table';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Button } from '../../../components/common/Button';
import { Plus, Eye, Key } from 'lucide-react';
import { Tenant } from '../../../types/tenant';
import { tenantsApi } from '../api/tenantsApi';

export const TenantsPage: React.FC = () => {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    tenantsApi.getTenants().then((data) => {
      setTenants(data);
      setIsLoading(false);
    });
  }, []);

  const columns: Column<Tenant>[] = [
    {
      key: 'name',
      header: 'Tenant Name',
      render: (t) => (
        <div>
          <strong className="text-brand">{t.name}</strong>
          <div className="text-muted text-xs">ID: {t.id}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) => <StatusBadge status={t.status} />,
    },
    {
      key: 'apiKey',
      header: 'API Key',
      render: (t) => (
        <code className="api-key-code">
          <Key size={12} className="inline-icon" /> {t.apiKey.substring(0, 16)}...
        </code>
      ),
    },
    {
      key: 'applicationsCount',
      header: 'Applications',
      render: (t) => <span>{t.applicationsCount} Apps</span>,
    },
    {
      key: 'usersCount',
      header: 'Users',
      render: (t) => <span>{t.usersCount} Users</span>,
    },
    {
      key: 'createdAt',
      header: 'Created At',
      render: (t) => (
        <span>
          {new Date(t.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (t) => (
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Eye size={14} />}
          onClick={() => navigate(`/tenants/${t.id}`)}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <div className="page-container-inner">
      <PageHeader
        title="Tenant Organizations"
        subtitle="Manage multi-tenant isolation, quotas, API keys, and settings"
        actions={
          <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => navigate('/tenants/create')}>
            Create Tenant
          </Button>
        }
      />

      <div className="card">
        <Table columns={columns} data={tenants} keyExtractor={(t) => t.id} isLoading={isLoading} />
      </div>
    </div>
  );
};
