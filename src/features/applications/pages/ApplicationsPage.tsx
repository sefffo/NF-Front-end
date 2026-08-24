import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Table, Column } from '../../../components/common/Table';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Button } from '../../../components/common/Button';
import { Plus, AppWindow, Eye } from 'lucide-react';
import { Application } from '../../../types/application';
import { applicationsApi } from '../api/applicationsApi';
import { TenantContext } from '../../../app/providers';

export const ApplicationsPage: React.FC = () => {
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

  const columns: Column<Application>[] = [
    {
      key: 'name',
      header: 'Application Name',
      render: (app) => (
        <div>
          <strong>{app.name}</strong>
          <div className="text-muted text-xs">{app.description}</div>
        </div>
      ),
    },
    {
      key: 'environment',
      header: 'Environment',
      render: (app) => <StatusBadge status={app.environment} label={app.environment} />,
    },
    {
      key: 'appKey',
      header: 'App Key',
      render: (app) => <code>{app.appKey}</code>,
    },
    {
      key: 'totalNotificationsSent',
      header: 'Total Sent',
      render: (app) => <span>{app.totalNotificationsSent.toLocaleString()}</span>,
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
          <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => navigate('/applications/create')}>
            Register Application
          </Button>
        }
      />

      <div className="card">
        <Table columns={columns} data={apps} keyExtractor={(a) => a.id} isLoading={isLoading} />
      </div>
    </div>
  );
};
