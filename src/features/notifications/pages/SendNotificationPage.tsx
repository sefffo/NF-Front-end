import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { Send, CheckCircle2 } from 'lucide-react';
import { NotificationChannel, NotificationPriority } from '../../../types/notification';
import { notificationsApi } from '../api/notificationsApi';
import { TenantContext } from '../../../app/providers';

export const SendNotificationPage: React.FC = () => {
  const navigate = useNavigate();
  const tenantCtx = useContext(TenantContext);

  const [channel, setChannel] = useState<NotificationChannel>('EMAIL');
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<NotificationPriority>('MEDIUM');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await notificationsApi.sendNotification({
        tenantId: tenantCtx?.activeTenant?.id || 'tnt_acme',
        applicationId: 'app_marketing_hub',
        channel,
        recipient,
        subject: channel === 'EMAIL' ? subject : undefined,
        content,
        priority,
      });
      setSuccessMsg(`Notification successfully queued & dispatched! Tracking ID: ${res.id}`);
      setTimeout(() => navigate('/notifications/history'), 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container-inner">
      <PageHeader title="Send Direct Notification" subtitle="Dispatch multi-channel alerts (Email, SMS, Push, Webhook)" />

      {successMsg && (
        <div className="alert alert-success mb-4">
          <CheckCircle2 size={18} /> {successMsg}
        </div>
      )}

      <div className="card card-padded max-w-2xl">
        <form onSubmit={handleSubmit} className="form-stack">
          <div className="form-grid-2col">
            <div className="input-group">
              <label className="input-label">Channel Target</label>
              <select className="input-field" value={channel} onChange={(e) => setChannel(e.target.value as NotificationChannel)}>
                <option value="EMAIL">EMAIL</option>
                <option value="SMS">SMS</option>
                <option value="PUSH">PUSH</option>
                <option value="WEBHOOK">WEBHOOK</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Priority Level</label>
              <select className="input-field" value={priority} onChange={(e) => setPriority(e.target.value as NotificationPriority)}>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT (Bypass Queue)</option>
              </select>
            </div>
          </div>

          <Input
            label={channel === 'EMAIL' ? 'Recipient Email' : channel === 'SMS' ? 'Recipient Phone Number' : 'Target Token / URL'}
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder={channel === 'EMAIL' ? 'user@example.com' : '+15552345678'}
            required
          />

          {channel === 'EMAIL' && (
            <Input
              label="Email Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Account Security Alert"
              required
            />
          )}

          <div className="input-group">
            <label className="input-label">Message Content Body</label>
            <textarea
              className="input-field textarea-field"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter message text, HTML snippet, or payload string..."
              required
            />
          </div>

          <Button type="submit" variant="primary" isLoading={isLoading} leftIcon={<Send size={16} />}>
            Dispatch Notification Now
          </Button>
        </form>
      </div>
    </div>
  );
};
