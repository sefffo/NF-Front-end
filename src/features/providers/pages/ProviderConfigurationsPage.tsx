import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Table, Column } from '../../../components/common/Table';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Button } from '../../../components/common/Button';
import { Plus, Radio } from 'lucide-react';
import { NotificationProviderConfig } from '../../../types/notification';
import { providersApi } from '../api/providersApi';
import { TenantContext } from '../../../app/providers';

export const ProviderConfigurationsPage: React.FC = () => {
  const navigate = useNavigate();
  const tenantCtx = useContext(TenantContext);
  const [providers, setProviders] = useState<NotificationProviderConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    providersApi.getProviders(tenantCtx?.activeTenant?.id).then((data) => {
      setProviders(data);
      setIsLoading(false);
    });
  }, [tenantCtx?.activeTenant?.id]);

  const columns: Column<NotificationProviderConfig>[] = [
    {
      key: 'name',
      header: 'Provider Name',
      render: (p) => (
        <div>
          <strong>{p.name}</strong>
          <div className="text-muted text-xs">Type: {p.providerType}</div>
        </div>
      ),
    },
    {
      key: 'channel',
      header: 'Channel',
      render: (p) => <span className="badge badge-purple">{p.channel}</span>,
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (p) => <StatusBadge status={p.isActive ? 'ACTIVE' : 'INACTIVE'} />,
    },
    {
      key: 'isDefault',
      header: 'Default Gateway',
      render: (p) => (p.isDefault ? <span className="badge badge-success">DEFAULT</span> : <span className="text-muted">Secondary</span>),
    },
  ];

  return (
    <div className="page-container-inner">
      <PageHeader
        title="Provider Configurations"
        subtitle="Manage dispatch gateways for Email (SendGrid/SES), SMS (Twilio), Push (FCM), and Webhooks"
        actions={
          <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => navigate('/providers/create')}>
            Add Provider Gateway
          </Button>
        }
      />

      <div className="card">
        <Table columns={columns} data={providers} keyExtractor={(p) => p.id} isLoading={isLoading} />
      </div>
    </div>
  );
};
