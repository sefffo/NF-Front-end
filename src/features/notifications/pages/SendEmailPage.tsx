import React, { useState } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { Send, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import { sendEmail, SendEmailRequest, ValidationErrorResponse } from '../api/emailApi';

// ─── State ────────────────────────────────────────────────────────────────────
type UiState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success'; messageId: string }
  | { kind: 'validation'; errors: ValidationErrorResponse }
  | { kind: 'domain'; message: string }
  | { kind: 'error'; message: string };

// ─── Helpers ─────────────────────────────────────────────────────────────────
function parseRecipients(raw: string): string[] {
  return raw
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// ─── Component ───────────────────────────────────────────────────────────────
export const SendEmailPage: React.FC = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [from, setFrom] = useState('');
  const [isHtml, setIsHtml] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [ui, setUi] = useState<UiState>({ kind: 'idle' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUi({ kind: 'loading' });

    const payload: SendEmailRequest = {
      to: parseRecipients(to),
      subject,
      body,
      ...(from.trim() && { from: from.trim() }),
      isHtml,
      ...(templateName.trim() && { templateName: templateName.trim() }),
    };

    const result = await sendEmail(payload);

    if (result.ok) {
      setUi({ kind: 'success', messageId: result.data.messageId });
      // Reset form
      setTo('');
      setSubject('');
      setBody('');
      setFrom('');
      setIsHtml(false);
      setTemplateName('');
      return;
    }

    if (result.status === 400) {
      setUi({ kind: 'validation', errors: result.errors });
      return;
    }

    if (result.status === 422) {
      setUi({ kind: 'domain', message: result.message });
      return;
    }

    setUi({ kind: 'error', message: result.message });
  };

  return (
    <div className="page-container-inner">
      <PageHeader
        title="Send Email Notification"
        subtitle="Dispatch a direct email using the notification backend"
      />

      {/* ── Success banner ── */}
      {ui.kind === 'success' && (
        <div className="alert alert-success mb-4">
          <CheckCircle2 size={18} />
          <span>
            Email sent successfully.{' '}
            <strong>Message ID: {ui.messageId}</strong>
          </span>
        </div>
      )}

      {/* ── Domain error banner (422) ── */}
      {ui.kind === 'domain' && (
        <div className="alert alert-error mb-4">
          <AlertTriangle size={18} />
          <span>{ui.message}</span>
        </div>
      )}

      {/* ── Generic error banner ── */}
      {ui.kind === 'error' && (
        <div className="alert alert-error mb-4">
          <AlertCircle size={18} />
          <span>{ui.message}</span>
        </div>
      )}

      {/* ── Validation errors banner (400) ── */}
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

      <div className="card card-padded max-w-2xl">
        <form onSubmit={handleSubmit} className="form-stack">
          {/* Recipients */}
          <div className="input-group">
            <label className="input-label">
              To <span className="text-muted text-xs">(comma or newline separated)</span>
            </label>
            <textarea
              className={`input-field textarea-field${
                ui.kind === 'validation' && ui.errors['to'] ? ' input-error' : ''
              }`}
              rows={2}
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="alice@example.com, bob@example.com"
              required
            />
            {ui.kind === 'validation' && ui.errors['to'] && (
              <p className="input-error-msg">{ui.errors['to'].join(', ')}</p>
            )}
          </div>

          {/* Subject */}
          <Input
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Account Security Alert"
            required
            className={ui.kind === 'validation' && ui.errors['subject'] ? 'input-error' : ''}
          />
          {ui.kind === 'validation' && ui.errors['subject'] && (
            <p className="input-error-msg -mt-2">{ui.errors['subject'].join(', ')}</p>
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
                ui.kind === 'validation' && ui.errors['body'] ? ' input-error' : ''
              }`}
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={isHtml ? '<h1>Hello!</h1><p>Your message here...</p>' : 'Plain text message...'}
              required
            />
            {ui.kind === 'validation' && ui.errors['body'] && (
              <p className="input-error-msg">{ui.errors['body'].join(', ')}</p>
            )}
          </div>

          {/* Template name (optional) */}
          <Input
            label={<>Template Name <span className="text-muted text-xs">(optional)</span></>}
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="e.g. welcome-email"
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
