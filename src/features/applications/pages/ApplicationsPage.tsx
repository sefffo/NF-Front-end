import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Table, Column } from '../../../components/common/Table';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Button } from '../../../components/common/Button';
import { Plus, Eye } from 'lucide-react';
import { Application } from '../../../types/application';
import { applicationsApi } from '../api/applicationsApi';
import { TenantContext } from '../../../app/providers';

export const ApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const tenantCtx = useContext(TenantContext);
  const tenantId = tenantCtx?.activeTenant?.id;

  const [apps, setApps] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tenantId) {
      setApps([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    applicationsApi
      .getApplications(tenantId)
      .then(setApps)
      .catch(() => setError('Failed to load applications. Please try again.'))
      .finally(() => setIsLoading(false));
  }, [tenantId]);

  const columns: Column<Application>[] = [
    {
      key: 'name',
      header: 'Application Name',
      render: (app) => (
        <div>
          <strong>{app.name}</strong>
          {app.description && <div className="text-muted text-xs">{app.description}</div>}
        </div>
      ),
    },
    {
      key: 'environment',
      header: 'Environment',
      render: (app) => <StatusBadge status={app.environment} label={app.environment} />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (app) => <StatusBadge status={app.status} label={app.status} />,
    },
    {
      key: 'clientKeyMasked',
      header: 'Client Key',
      render: (app) => <code className="text-xs">{app.clientKeyMasked}</code>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (app) => (
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Eye size={14} />}
          onClick={() => navigate(`/applications/${app.id}`)}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <div className="page-container-inner">
      <PageHeader
        title="Applications"
        subtitle="Registered microservices and client applications using the notification engine"
        actions={
          <Button
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={() => navigate('/applications/create')}
            disabled={!tenantId}
          >
            Register Application
          </Button>
        }
      />

      {!tenantId && (
        <div role="alert" className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>
          Please select an active tenant to view its applications.
        </div>
      )}

      {error && (
        <div role="alert" className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>
          {error}
        </div>
      )}

      <div className="card">
        <Table columns={columns} data={apps} keyExtractor={(a) => a.id} isLoading={isLoading} />
      </div>
    </div>
  );
};
