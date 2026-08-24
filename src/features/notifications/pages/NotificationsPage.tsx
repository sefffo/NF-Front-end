import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Table, Column } from '../../../components/common/Table';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Button } from '../../../components/common/Button';
import { Send, Eye, RefreshCw } from 'lucide-react';
import { NotificationRecord } from '../../../types/notification';
import { notificationsApi } from '../api/notificationsApi';
import { TenantContext } from '../../../app/providers';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const tenantCtx = useContext(TenantContext);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecords = () => {
    setIsLoading(true);
    notificationsApi.getNotifications(tenantCtx?.activeTenant?.id).then((data) => {
      setNotifications(data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchRecords();
  }, [tenantCtx?.activeTenant?.id]);

  const columns: Column<NotificationRecord>[] = [
    {
      key: 'id',
      header: 'Tracking ID',
      render: (n) => <code>{n.id}</code>,
    },
    {
      key: 'channel',
      header: 'Channel',
      render: (n) => <span className="badge badge-purple">{n.channel}</span>,
    },
    {
      key: 'recipient',
      header: 'Recipient Target',
      render: (n) => <strong className="text-sm">{n.recipient}</strong>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (n) => <StatusBadge status={n.status} />,
    },
    {
      key: 'sentAt',
      header: 'Timestamp',
      render: (n) => <span className="text-muted text-xs">{n.sentAt || n.createdAt}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (n) => (
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Eye size={14} />}
          onClick={() => navigate(`/notifications/${n.id}`)}
        >
          Inspect
        </Button>
      ),
    },
  ];

  return (
    <div className="page-container-inner">
      <PageHeader
        title="Notifications Feed"
        subtitle="Real-time dispatch log across all connected applications and provider gateways"
        actions={
          <div className="button-group">
            <Button variant="outline" leftIcon={<RefreshCw size={16} />} onClick={fetchRecords}>
              Refresh Log
            </Button>
            <Button variant="primary" leftIcon={<Send size={16} />} onClick={() => navigate('/notifications/send')}>
              Send Notification
            </Button>
          </div>
        }
      />

      <div className="card">
        <Table columns={columns} data={notifications} keyExtractor={(n) => n.id} isLoading={isLoading} />
      </div>
    </div>
  );
};
