import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Button } from '../../../components/common/Button';
import { ArrowLeft, RefreshCw, Send } from 'lucide-react';
import { NotificationRecord } from '../../../types/notification';
import { notificationsApi } from '../api/notificationsApi';

export const NotificationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<NotificationRecord | null>(null);

  useEffect(() => {
    if (id) {
      notificationsApi.getNotificationById(id).then((r) => setRecord(r || null));
    }
  }, [id]);

  if (!record) return <div className="p-6">Loading notification record...</div>;

  return (
    <div className="page-container-inner">
      <PageHeader
        title={`Notification Payload: ${record.id}`}
        subtitle={`App: ${record.applicationName} • Channel: ${record.channel}`}
        actions={
          <Button variant="outline" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate('/notifications')}>
            Back to Feed
          </Button>
        }
      />

      <div className="card card-padded mt-4">
        <div className="flex justify-between items-center pb-4 border-b">
          <div>
            <span className="text-muted text-sm">Delivery Status:</span>
            <div className="mt-1"><StatusBadge status={record.status} /></div>
          </div>
          <div>
            <span className="text-muted text-sm">Priority:</span>
            <div className="mt-1"><StatusBadge status={record.priority} /></div>
          </div>
        </div>

        <div className="mt-4">
          <h4>Recipient & Metadata</h4>
          <p><strong>Target:</strong> {record.recipient}</p>
          {record.subject && <p><strong>Subject:</strong> {record.subject}</p>}
        </div>

        <div className="mt-4">
          <h4>Message Content Payload</h4>
          <pre className="code-block">{record.contentSnippet}</pre>
        </div>
      </div>
    </div>
  );
};
