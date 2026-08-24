import React, { useEffect, useState, useContext } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Table, Column } from '../../../components/common/Table';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Pagination } from '../../../components/common/Pagination';
import { NotificationRecord } from '../../../types/notification';
import { notificationsApi } from '../api/notificationsApi';
import { TenantContext } from '../../../app/providers';

export const NotificationHistoryPage: React.FC = () => {
  const tenantCtx = useContext(TenantContext);
  const [records, setRecords] = useState<NotificationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    notificationsApi.getNotifications(tenantCtx?.activeTenant?.id).then((data) => {
      setRecords(data);
      setIsLoading(false);
    });
  }, [tenantCtx?.activeTenant?.id]);

  const columns: Column<NotificationRecord>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (r) => <code>{r.id}</code>,
    },
    {
      key: 'applicationName',
      header: 'Application',
      render: (r) => <span>{r.applicationName}</span>,
    },
    {
      key: 'channel',
      header: 'Channel',
      render: (r) => <span className="badge badge-purple">{r.channel}</span>,
    },
    {
      key: 'recipient',
      header: 'Recipient',
      render: (r) => <span>{r.recipient}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'retryCount',
      header: 'Retries',
      render: (r) => <span>{r.retryCount}</span>,
    },
    {
      key: 'createdAt',
      header: 'Created At',
      render: (r) => <span className="text-muted text-xs">{r.createdAt}</span>,
    },
  ];

  return (
    <div className="page-container-inner">
      <PageHeader title="Dispatch Audit History" subtitle="Comprehensive historical log of dispatches, webhooks, and retry attempts" />

      <div className="card">
        <Table columns={columns} data={records} keyExtractor={(r) => r.id} isLoading={isLoading} />
        <div className="p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={3}
            onPageChange={setCurrentPage}
            totalItems={records.length}
            itemsPerPage={10}
          />
        </div>
      </div>
    </div>
  );
};
