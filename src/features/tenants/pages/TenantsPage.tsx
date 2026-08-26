import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Table, Column } from '../../../components/common/Table';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Button } from '../../../components/common/Button';
import { Plus, Eye, Key } from 'lucide-react';
import { tenantsApi, TenantListDto } from '../api/tenantsApi';

export const TenantsPage: React.FC = () => {
  const navigate = useNavigate();
  const [tenants, setTenants]     = useState<TenantListDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    tenantsApi
      .getTenantsRaw()
      .then((data) => setTenants(data))
      .catch(() => setError('Failed to load tenants. Please refresh the page.'))
      .finally(() => setIsLoading(false));
  }, []);

  const columns: Column<TenantListDto>[] = [
    {
      key: 'name',
      header: 'Tenant Name',
      render: (t) => (
        <div>
          <strong className="text-brand">{t.name}</strong>
          <div className="text-muted text-xs">/{t.slug}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) => <StatusBadge status={t.status.toUpperCase()} />,
    },
    {
      key: 'apiKeyMasked',
      header: 'API Key',
      render: (t) => (
        <code className="api-key-code">
          <Key size={12} className="inline-icon" /> {t.apiKeyMasked}
        </code>
      ),
    },
    {
      key: 'applicationCount',
      header: 'Applications',
      render: (t) => <span>{t.applicationCount} Apps</span>,
    },
    {
      key: 'userCount',
      header: 'Users',
      render: (t) => <span>{t.userCount} Users</span>,
    },
    {
      key: 'maxDailyNotifications',
      header: 'Daily Limit',
      render: (t) => <span>{t.maxDailyNotifications.toLocaleString()} / day</span>,
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
          onClick={() => navigate(`/tenants/${t.tenantId}`)}
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
          <Button
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={() => navigate('/tenants/create')}
          >
            Create Tenant
          </Button>
        }
      />

      {error && (
        <div role="alert" className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>
          {error}
        </div>
      )}

      <div className="card">
        <Table
          columns={columns}
          data={tenants}
          keyExtractor={(t) => t.tenantId}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
