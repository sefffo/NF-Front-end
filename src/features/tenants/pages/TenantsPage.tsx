import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Table, Column } from '../../../components/common/Table';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Button } from '../../../components/common/Button';
import { Plus, Eye, Key } from 'lucide-react';
<<<<<<< HEAD
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
=======
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
>>>>>>> develop
    {
      key: 'name',
      header: 'Tenant Name',
      render: (t) => (
        <div>
          <strong className="text-brand">{t.name}</strong>
<<<<<<< HEAD
          <div className="text-muted text-xs">/{t.slug}</div>
=======
          <div className="text-muted text-xs">ID: {t.id}</div>
>>>>>>> develop
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
<<<<<<< HEAD
      render: (t) => <StatusBadge status={t.status.toUpperCase()} />,
    },
    {
      key: 'apiKeyMasked',
      header: 'API Key',
      render: (t) => (
        <code className="api-key-code">
          <Key size={12} className="inline-icon" /> {t.apiKeyMasked}
=======
      render: (t) => <StatusBadge status={t.status} />,
    },
    {
      key: 'apiKey',
      header: 'API Key',
      render: (t) => (
        <code className="api-key-code">
          <Key size={12} className="inline-icon" /> {t.apiKey.substring(0, 16)}...
>>>>>>> develop
        </code>
      ),
    },
    {
<<<<<<< HEAD
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
=======
      key: 'applicationsCount',
      header: 'Applications',
      render: (t) => <span>{t.applicationsCount} Apps</span>,
    },
    {
      key: 'usersCount',
      header: 'Users',
      render: (t) => <span>{t.usersCount} Users</span>,
>>>>>>> develop
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
<<<<<<< HEAD
          onClick={() => navigate(`/tenants/${t.tenantId}`)}
=======
          onClick={() => navigate(`/tenants/${t.id}`)}
>>>>>>> develop
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
<<<<<<< HEAD
          <Button
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={() => navigate('/tenants/create')}
          >
=======
          <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => navigate('/tenants/create')}>
>>>>>>> develop
            Create Tenant
          </Button>
        }
      />

<<<<<<< HEAD
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
=======
      <div className="card">
        <Table columns={columns} data={tenants} keyExtractor={(t) => t.id} isLoading={isLoading} />
>>>>>>> develop
      </div>
    </div>
  );
};
