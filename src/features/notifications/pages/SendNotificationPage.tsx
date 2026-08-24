import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { Send, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import { NotificationChannel, NotificationPriority } from '../../../types/notification';
import { notificationsApi } from '../api/notificationsApi';
import { sendEmail } from '../api/emailApi';
import { AuthContext, TenantContext } from '../../../app/providers';

// ─── UI feedback state ─────────────────────────────────────────────────────────
type UiState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success'; message: string }
  | { kind: 'validation'; errors: Record<string, string[]> }
  | { kind: 'domain'; title: string; detail: string }
  | { kind: 'error'; message: string };

function parseRecipients(raw: string): string[] {
  return raw
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export const SendNotificationPage: React.FC = () => {
  const navigate  = useNavigate();
  const tenantCtx = useContext(TenantContext);
  const authCtx   = useContext(AuthContext);

  const [channel, setChannel]     = useState<NotificationChannel>('EMAIL');
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject]     = useState('');
  const [content, setContent]     = useState('');
  const [priority, setPriority]   = useState<NotificationPriority>('MEDIUM');
  const [isHtml, setIsHtml]       = useState(false);
  const [ui, setUi]               = useState<UiState>({ kind: 'idle' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUi({ kind: 'loading' });

    // ── EMAIL → real backend POST /api/notifications/email ──────────────────────
    if (channel === 'EMAIL') {
      const tenantId      = tenantCtx?.activeTenant?.id ?? '';
      const applicationId = tenantCtx?.activeTenant?.applicationId ?? '';

      if (!tenantId) {
        setUi({ kind: 'error', message: 'No active tenant selected. Please select a tenant first.' });
        return;
      }

      const result = await sendEmail({
        tenantId,
        applicationId,
        to: parseRecipients(recipient),
        subject,
        body: content,
        isHtml,
      });

      if (result.ok) {
        setUi({ kind: 'success', message: `Email sent successfully. Message ID: ${result.data.messageId}` });
        setTimeout(() => navigate('/notifications/history'), 2000);
        return;
      }
      if (result.status === 400) { setUi({ kind: 'validation', errors: result.errors }); return; }
      if (result.status === 422 || result.status === 403) { setUi({ kind: 'domain', title: result.title, detail: result.detail }); return; }
      setUi({ kind: 'error', message: result.message });
      return;
    }

    // ── SMS / PUSH / WEBHOOK → existing mock ─────────────────────────────────
    try {
      const res = await notificationsApi.sendNotification({
        tenantId: tenantCtx?.activeTenant?.id || 'tnt_acme',
        applicationId: authCtx?.user?.applicationId || 'app_marketing_hub',
        channel,
        recipient,
        subject: undefined,
        content,
        priority,
      });
      setUi({ kind: 'success', message: `Notification queued! Tracking ID: ${res.id}` });
      setTimeout(() => navigate('/notifications/history'), 1500);
    } catch {
      setUi({ kind: 'error', message: 'Failed to send notification.' });
    }
  };

  const fieldError = (field: string) => {
    if (ui.kind !== 'validation') return undefined;
    return (ui.errors[field] ?? ui.errors[field.toLowerCase()] ?? ui.errors[field.toUpperCase()])?.join(', ');
  };

  return (
    <div className="page-container-inner">
      <PageHeader
        title="Send Direct Notification"
        subtitle="Dispatch multi-channel alerts (Email, SMS, Push, Webhook)"
      />

      {ui.kind === 'success' && (
        <div className="alert alert-success mb-4"><CheckCircle2 size={18} /><span>{ui.message}</span></div>
      )}
      {ui.kind === 'domain' && (
        <div className="alert alert-error mb-4">
          <AlertTriangle size={18} />
          <div className="flex flex-col"><strong>{ui.title}</strong><span>{ui.detail}</span></div>
        </div>
      )}
      {ui.kind === 'validation' && (
        <div className="alert alert-warning mb-4">
          <AlertCircle size={18} />
          <div className="flex flex-col gap-1">
            {Object.entries(ui.errors).map(([field, messages]) =>
              messages.map((msg, i) => (
                <span key={`${field}-${i}`}><strong className="capitalize">{field}:</strong> {msg}</span>
              ))
            )}
          </div>
        </div>
      )}
      {ui.kind === 'error' && (
        <div className="alert alert-error mb-4"><AlertCircle size={18} /><span>{ui.message}</span></div>
      )}

      <div className="card card-padded max-w-2xl">
        <form onSubmit={handleSubmit} className="form-stack">
          <div className="form-grid-2col">
            <div className="input-group">
              <label className="input-label">Channel Target</label>
              <select
                className="input-field"
                value={channel}
                onChange={(e) => { setChannel(e.target.value as NotificationChannel); setUi({ kind: 'idle' }); }}
              >
                <option value="EMAIL">EMAIL</option>
                <option value="SMS">SMS</option>
                <option value="PUSH">PUSH</option>
                <option value="WEBHOOK">WEBHOOK</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Priority Level</label>
              <select
                className="input-field"
                value={priority}
                onChange={(e) => setPriority(e.target.value as NotificationPriority)}
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT (Bypass Queue)</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">
              {channel === 'EMAIL' ? 'Recipient Email(s)' : channel === 'SMS' ? 'Recipient Phone Number' : 'Target Token / URL'}
              {channel === 'EMAIL' && <span className="text-muted text-xs ml-1">(comma-separated for multiple)</span>}
            </label>
            <Input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder={channel === 'EMAIL' ? 'user@example.com, other@example.com' : '+15552345678'}
              required
              className={fieldError('To') || fieldError('to') ? 'input-error' : ''}
            />
            {(fieldError('To') || fieldError('to')) && (
              <p className="input-error-msg">{fieldError('To') ?? fieldError('to')}</p>
            )}
          </div>

          {channel === 'EMAIL' && (
            <div className="input-group">
              <Input
                label="Email Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Account Security Alert"
                required
                className={fieldError('Subject') || fieldError('subject') ? 'input-error' : ''}
              />
              {(fieldError('Subject') || fieldError('subject')) && (
                <p className="input-error-msg">{fieldError('Subject') ?? fieldError('subject')}</p>
              )}
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Message Content Body</label>
            <textarea
              className={`input-field textarea-field${fieldError('Body') || fieldError('body') ? ' input-error' : ''}`}
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter message text, HTML snippet, or payload string..."
              required
            />
            {(fieldError('Body') || fieldError('body')) && (
              <p className="input-error-msg">{fieldError('Body') ?? fieldError('body')}</p>
            )}
          </div>

          {channel === 'EMAIL' && (
            <div className="flex items-center gap-3">
              <input id="isHtml" type="checkbox" checked={isHtml} onChange={(e) => setIsHtml(e.target.checked)} className="checkbox" />
              <label htmlFor="isHtml" className="input-label mb-0 cursor-pointer">Send as HTML</label>
            </div>
          )}

          <Button type="submit" variant="primary" isLoading={ui.kind === 'loading'} leftIcon={<Send size={16} />}>
            Dispatch Notification Now
          </Button>
        </form>
      </div>
    </div>
  );
};
