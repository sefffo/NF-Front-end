import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Table, Column } from '../../../components/common/Table';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Button } from '../../../components/common/Button';
<<<<<<< HEAD
import { Plus, Eye, RefreshCw } from 'lucide-react';
=======
import { Plus, AppWindow, Eye } from 'lucide-react';
>>>>>>> develop
import { Application } from '../../../types/application';
import { applicationsApi } from '../api/applicationsApi';
import { TenantContext } from '../../../app/providers';

export const ApplicationsPage: React.FC = () => {
<<<<<<< HEAD
  const navigate  = useNavigate();
  const tenantCtx = useContext(TenantContext);
  const tenantId  = tenantCtx?.activeTenant?.id;

  const [apps, setApps]           = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const load = (id: string) => {
    setIsLoading(true);
    setError(null);
    applicationsApi
      .getApplications(id)
      .then(setApps)
      .catch(() => setError('Failed to load applications. Please try again.'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!tenantId) {
      setApps([]);
      setError(null);
      return;
    }
    load(tenantId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);
=======
  const navigate = useNavigate();
  const tenantCtx = useContext(TenantContext);
  const [apps, setApps] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    applicationsApi.getApplications(tenantCtx?.activeTenant?.id).then((data) => {
      setApps(data);
      setIsLoading(false);
    });
  }, [tenantCtx?.activeTenant?.id]);
>>>>>>> develop

  const columns: Column<Application>[] = [
    {
      key: 'name',
      header: 'Application Name',
      render: (app) => (
        <div>
          <strong>{app.name}</strong>
<<<<<<< HEAD
          {app.description && <div className="text-muted text-xs">{app.description}</div>}
=======
          <div className="text-muted text-xs">{app.description}</div>
>>>>>>> develop
        </div>
      ),
    },
    {
      key: 'environment',
      header: 'Environment',
      render: (app) => <StatusBadge status={app.environment} label={app.environment} />,
    },
    {
<<<<<<< HEAD
      key: 'status',
      header: 'Status',
      render: (app) => <StatusBadge status={app.status} label={app.status} />,
    },
    {
      key: 'clientKeyMasked',
      header: 'Client Key',
      render: (app) => <code className="text-xs">{app.clientKeyMasked}</code>,
=======
      key: 'appKey',
      header: 'App Key',
      render: (app) => <code>{app.appKey}</code>,
    },
    {
      key: 'totalNotificationsSent',
      header: 'Total Sent',
      render: (app) => <span>{app.totalNotificationsSent.toLocaleString()}</span>,
>>>>>>> develop
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
<<<<<<< HEAD
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {tenantId && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<RefreshCw size={14} />}
                onClick={() => load(tenantId)}
                disabled={isLoading}
              >
                Refresh
              </Button>
            )}
            <Button
              variant="primary"
              leftIcon={<Plus size={16} />}
              onClick={() => navigate('/applications/create')}
              disabled={!tenantId}
            >
              Register Application
            </Button>
          </div>
        }
      />

      {!tenantId && (
        <div role="alert" className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>
          No active tenant found. Please log in again or contact your administrator.
        </div>
      )}

      {error && (
        <div role="alert" className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>
          {error}
        </div>
      )}

=======
          <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => navigate('/applications/create')}>
            Register Application
          </Button>
        }
      />

>>>>>>> develop
      <div className="card">
        <Table columns={columns} data={apps} keyExtractor={(a) => a.id} isLoading={isLoading} />
      </div>
    </div>
  );
};
