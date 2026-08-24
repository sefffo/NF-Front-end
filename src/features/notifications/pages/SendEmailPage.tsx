import React, { useState } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { Send, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import { sendEmail, SendEmailRequest, EmailApiResult } from '../api/emailApi';

// ─── UI State machine ─────────────────────────────────────────────────────────
type UiState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success'; messageId: string; requestId: string }
  | { kind: 'validation'; errors: Record<string, string[]> }
  | { kind: 'domain'; title: string; detail: string }
  | { kind: 'error'; message: string };

// ─── Helpers ──────────────────────────────────────────────────────────────────
function parseRecipients(raw: string): string[] {
  return raw
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function resultToUiState(result: EmailApiResult): UiState {
  if (result.ok) {
    return { kind: 'success', messageId: result.data.messageId, requestId: result.data.requestId };
  }
  if (result.status === 400) {
    return { kind: 'validation', errors: result.errors };
  }
  if (result.status === 422 || result.status === 403) {
    return { kind: 'domain', title: result.title, detail: result.detail };
  }
  return { kind: 'error', message: result.message };
}

// ─── Component ────────────────────────────────────────────────────────────────
export const SendEmailPage: React.FC = () => {
  // Form fields
  const [tenantId, setTenantId]       = useState('');
  const [applicationId, setApplicationId] = useState('');
  const [to, setTo]                   = useState('');
  const [subject, setSubject]         = useState('');
  const [body, setBody]               = useState('');
  const [from, setFrom]               = useState('');
  const [isHtml, setIsHtml]           = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState('');

  const [ui, setUi] = useState<UiState>({ kind: 'idle' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUi({ kind: 'loading' });

    const payload: SendEmailRequest = {
      tenantId: tenantId.trim(),
      applicationId: applicationId.trim(),
      to: parseRecipients(to),
      subject: subject.trim(),
      body: body.trim(),
      ...(from.trim() && { from: from.trim() }),
      isHtml,
      ...(idempotencyKey.trim() && { idempotencyKey: idempotencyKey.trim() }),
    };

    const result = await sendEmail(payload);
    setUi(resultToUiState(result));

    if (result.ok) {
      setTo('');
      setSubject('');
      setBody('');
      setFrom('');
      setIsHtml(false);
      setIdempotencyKey('');
    }
  };

  const validationErr = (field: string) =>
    ui.kind === 'validation' ? ui.errors[field] ?? ui.errors[field.toLowerCase()] : undefined;

  return (
    <div className="page-container-inner">
      <PageHeader
        title="Send Email Notification"
        subtitle="Dispatch an email via the notification backend"
      />

      {/* ── 200 Success ── */}
      {ui.kind === 'success' && (
        <div className="alert alert-success mb-4">
          <CheckCircle2 size={18} />
          <span>
            Email sent successfully.{' '}
            <strong>Message ID: {ui.messageId}</strong>
            {ui.requestId && (
              <span className="text-muted text-xs ml-2">(Request: {ui.requestId})</span>
            )}
          </span>
        </div>
      )}

      {/* ── 422 / 403 Domain error ── */}
      {ui.kind === 'domain' && (
        <div className="alert alert-error mb-4">
          <AlertTriangle size={18} />
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold">{ui.title}</span>
            <span className="text-sm">{ui.detail}</span>
          </div>
        </div>
      )}

      {/* ── 400 Validation errors ── */}
      {ui.kind === 'validation' && (
        <div className="alert alert-warning mb-4">
          <AlertCircle size={18} />
          <div className="flex flex-col gap-1">
            {Object.entries(ui.errors).map(([field, messages]) =>
              messages.map((msg, i) => (
                <span key={`${field}-${i}`}>
                  <strong className="capitalize">{field}:</strong> {msg}
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Generic / network error ── */}
      {ui.kind === 'error' && (
        <div className="alert alert-error mb-4">
          <AlertCircle size={18} />
          <span>{ui.message}</span>
        </div>
      )}

      <div className="card card-padded max-w-2xl">
        <form onSubmit={handleSubmit} className="form-stack">

          {/* Tenant ID */}
          <Input
            label="Tenant ID"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            required
            className={validationErr('tenantId') ? 'input-error' : ''}
          />
          {validationErr('tenantId') && (
            <p className="input-error-msg -mt-2">{validationErr('tenantId')!.join(', ')}</p>
          )}

          {/* Application ID */}
          <Input
            label="Application ID"
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            required
            className={validationErr('applicationId') ? 'input-error' : ''}
          />
          {validationErr('applicationId') && (
            <p className="input-error-msg -mt-2">{validationErr('applicationId')!.join(', ')}</p>
          )}

          {/* Recipients */}
          <div className="input-group">
            <label className="input-label">
              To <span className="text-muted text-xs">(comma or newline separated)</span>
            </label>
            <textarea
              className={`input-field textarea-field${
                validationErr('to') ? ' input-error' : ''
              }`}
              rows={2}
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="alice@example.com, bob@example.com"
              required
            />
            {validationErr('to') && (
              <p className="input-error-msg">{validationErr('to')!.join(', ')}</p>
            )}
          </div>

          {/* Subject */}
          <Input
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Account Security Alert"
            required
            className={validationErr('subject') ? 'input-error' : ''}
          />
          {validationErr('subject') && (
            <p className="input-error-msg -mt-2">{validationErr('subject')!.join(', ')}</p>
          )}

          {/* From (optional) */}
          <Input
            label={<>From <span className="text-muted text-xs">(optional)</span></>}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="no-reply@yourdomain.com"
          />

          {/* Body */}
          <div className="input-group">
            <label className="input-label">Body</label>
            <textarea
              className={`input-field textarea-field${
                validationErr('body') ? ' input-error' : ''
              }`}
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={
                isHtml
                  ? '<h1>Hello!</h1><p>Your message here...</p>'
                  : 'Plain text message...'
              }
              required
            />
            {validationErr('body') && (
              <p className="input-error-msg">{validationErr('body')!.join(', ')}</p>
            )}
          </div>

          {/* Idempotency Key (optional) */}
          <Input
            label={<>Idempotency Key <span className="text-muted text-xs">(optional — prevents duplicate sends)</span></>}
            value={idempotencyKey}
            onChange={(e) => setIdempotencyKey(e.target.value)}
            placeholder="e.g. order-123-welcome"
          />

          {/* isHtml toggle */}
          <div className="flex items-center gap-3">
            <input
              id="isHtml"
              type="checkbox"
              checked={isHtml}
              onChange={(e) => setIsHtml(e.target.checked)}
              className="checkbox"
            />
            <label htmlFor="isHtml" className="input-label mb-0 cursor-pointer">
              Send as HTML
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={ui.kind === 'loading'}
            leftIcon={<Send size={16} />}
          >
            Send Email
          </Button>
        </form>
      </div>
    </div>
  );
};
