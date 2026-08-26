import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import axios from 'axios';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { applicationsApi } from '../api/applicationsApi';
import { AppEnvironment, CreateApplicationResponse } from '../../../types/application';
import { TenantContext } from '../../../app/providers';

// ── Error message resolver ────────────────────────────────────────────
function resolveErrorMessage(status: number, data: unknown): string {
  if (status === 403) return "You don't have permission to register an application.";
  if (status === 404) return 'Tenant not found. Please select a valid tenant.';
  if (status === 409) return 'An application with this name already exists under this tenant.';
  if (status === 400) {
    if (data && typeof data === 'object') {
      const d = data as Record<string, unknown>;
      if (d.errors && typeof d.errors === 'object') {
        const first = Object.values(d.errors as Record<string, string[]>)[0];
        if (Array.isArray(first) && first.length > 0) return first[0];
      }
      if (typeof d.message === 'string') return d.message;
      if (typeof d.title === 'string') return d.title;
    }
    return 'Validation failed. Please check your inputs.';
  }
  return 'Something went wrong. Please try again.';
}

// ── One-time ClientKey modal ──────────────────────────────────────────
interface ClientKeyModalProps {
  result: CreateApplicationResponse;
  onDismiss: () => void;
}
const ClientKeyModal: React.FC<ClientKeyModalProps> = ({ result, onDismiss }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(result.clientKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="clientkey-title"
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'oklch(0 0 0 / 0.55)',
      }}
    >
      <div className="card card-padded" style={{ maxWidth: 480, width: '100%' }}>
        <h2 id="clientkey-title" style={{ marginBottom: 'var(--space-2)' }}>
          Application Created — Save Your Client Key
        </h2>
        <p className="text-muted" style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
          <strong>This is the only time the plain-text client key will be shown.</strong>{' '}
          Copy it now and store it securely.
        </p>

        <div style={{ marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          Application: <strong style={{ color: 'var(--color-text)' }}>{result.name}</strong>
          &nbsp;&middot;&nbsp;
          Slug: <code>{result.slug}</code>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          marginBottom: 'var(--space-6)',
        }}>
          <code style={{
            flex: 1, padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
            background: 'var(--color-surface-offset)', fontSize: 'var(--text-sm)',
            wordBreak: 'break-all',
          }}>
            {result.clientKey}
          </code>
          <Button variant="secondary" size="sm" onClick={handleCopy}>
            {copied ? '\u2713 Copied' : 'Copy'}
          </Button>
        </div>

        <Button variant="primary" onClick={onDismiss} style={{ width: '100%' }}>
          I’ve saved the key — Continue
        </Button>
      </div>
    </div>
  );
};

// ── Page ─────────────────────────────────────────────────────────────
export const CreateApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const tenantCtx = useContext(TenantContext);
  const tenantId = tenantCtx?.activeTenant?.id;

  const [name, setName] = useState('');
  const [environment, setEnvironment] = useState<AppEnvironment>('Development');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [createdApp, setCreatedApp] = useState<CreateApplicationResponse | null>(null);

  // ── Validation ───────────────────────────────────────────────────────
  const [nameError, setNameError] = useState('');
  const [nameTouched, setNameTouched] = useState(false);
  const validateName = (v: string) => (!v.trim() ? 'Application name is required.' : '');

  const handleNameBlur = () => {
    setNameTouched(true);
    setNameError(validateName(name));
  };

  // ── Submit ───────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameTouched(true);
    const nErr = validateName(name);
    setNameError(nErr);
    if (nErr) return;

    if (!tenantId) {
      setServerError('No active tenant selected. Please select a tenant first.');
      return;
    }

    setIsLoading(true);
    setServerError(null);
    try {
      const result = await applicationsApi.createApplication({ tenantId, name: name.trim(), environment, description });
      setCreatedApp(result);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setServerError(resolveErrorMessage(err.response.status, err.response.data));
      } else {
        setServerError('An unexpected error occurred. Please try again.');
      }
=======
import { Check, Copy, ShieldCheck, TriangleAlert } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { applicationsApi } from '../api/applicationsApi';
import { AppEnvironment, CreateApplicationResponse } from '../../../types/application';
import { TenantContext } from '../../../app/providers';
import { extractApiError } from '../../../utils/apiError';

export const CreateApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const tenantCtx = useContext(TenantContext);

  const [name, setName] = useState('');
  const [environment, setEnvironment] = useState<AppEnvironment>('DEVELOPMENT');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // API error message + created application (for the one-time key reveal)
  const [error, setError] = useState<string | null>(null);
  const [createdApp, setCreatedApp] = useState<CreateApplicationResponse | null>(null);
  const [copied, setCopied] = useState(false);
  
  const tenantId = tenantCtx?.activeTenant?.id;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await applicationsApi.createApplication(tenantId, {
        name,
        environment,
        description,
      });
      setCreatedApp(result);
      setCopied(false);
    } catch (err) {
      setError(extractApiError(err).message);
>>>>>>> develop
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
  return (
    <>
      {createdApp && (
        <ClientKeyModal result={createdApp} onDismiss={() => navigate('/applications')} />
      )}

      <div className="page-container-inner">
        <PageHeader
          title="Register Application"
          subtitle="Generate App credentials for a new client service"
        />

        <div className="card card-padded max-w-xl">
          <form onSubmit={handleSubmit} className="form-stack" noValidate>
            {serverError && (
              <div role="alert" className="alert alert-error">
                <span>{serverError}</span>
              </div>
            )}

            <Input
              label="Application Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameTouched) setNameError(validateName(e.target.value));
              }}
              onBlur={handleNameBlur}
              placeholder="e.g. Acme Marketing Engine"
              error={nameError}
              required
            />

            <div className="input-group">
              <label className="input-label">Environment</label>
              <select
                className="input-field"
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as AppEnvironment)}
              >
                <option value="Development">Development</option>
                <option value="Staging">Staging</option>
                <option value="Production">Production</option>
              </select>
            </div>

            <Input
              label="Description (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief purpose of this application..."
            />

            <div className="form-actions">
              <Button type="submit" variant="primary" isLoading={isLoading}>
                Generate App Credentials
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
=======
  // Copy the one-time client key to the clipboard
  const handleCopy = async () => {
    if (!createdApp) return;
    await navigator.clipboard.writeText(createdApp.clientKey);
    setCopied(true);
  };

  const handleDone = () => navigate('/applications');

  return (
    <div className="page-container-inner">
      <PageHeader
        title="Register Application"
        subtitle="Generate App Key and Secret credentials for a new client service"
      />

      {/* creation requires an active tenant with a real GUID */}
      {!tenantId && (
        <div
          className="card card-padded"
          style={{ color: 'var(--accent-danger)', marginBottom: '1rem' }}
          role="alert"
        >
          No active tenant selected. Please select a tenant before registering an application.
        </div>
      )}

      <div className="card card-padded max-w-xl">
        <form onSubmit={handleSubmit} className="form-stack">
          <Input
            label="Application Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Acme Marketing Engine"
            required
          />

          <div className="input-group">
            <label className="input-label">Environment</label>
            <select
              className="input-field"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value as AppEnvironment)}
            >
              <option value="DEVELOPMENT">DEVELOPMENT</option>
              <option value="STAGING">STAGING</option>
              <option value="PRODUCTION">PRODUCTION</option>
            </select>
          </div>

          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief purpose of this application..."
          />

          {/* surfaces backend ProblemDetails messages (409 duplicate / 404 tenant / 422 quota) */}
          {error && (
            <div
              role="alert"
              style={{
                color: 'var(--accent-danger)',
                border: '1px solid var(--accent-danger)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
              }}
            >
              ⚠ {error}
            </div>
          )}

          <Button type="submit" variant="primary" isLoading={isLoading} disabled={!tenantId}>
            Generate App Credentials
          </Button>
        </form>
      </div>

      {/* one-time client-key reveal — the key can never be recovered after this.
          Task 96: redesigned — modal styles were missing entirely and the key
          chip used a light background on the dark theme */}
      <Modal
        isOpen={!!createdApp}
        onClose={handleDone}
        title="Application Registered"
        footer={
          <Button variant="primary" onClick={handleDone}>
            Done
          </Button>
        }
      >
        <div className="key-reveal-banner">
          <span className="key-reveal-banner-icon">
            <ShieldCheck size={20} />
          </span>
          <span className="key-reveal-banner-text">
            {createdApp?.name} is ready to use
          </span>
        </div>

        <div className="key-reveal-summary">
          <span className="key-reveal-label">Name</span>
          <span className="key-reveal-value">{createdApp?.name}</span>
          <span className="key-reveal-label">Environment</span>
          <span className="key-reveal-value">{createdApp?.environment}</span>
          <span className="key-reveal-label">Slug</span>
          <span className="key-reveal-value">{createdApp?.slug}</span>
        </div>

        <div className="key-reveal-warning">
          <TriangleAlert size={16} />
          <span>
            Copy your client key now. It is shown <strong>only once</strong> and
            cannot be recovered later — store it somewhere safe before closing
            this dialog.
          </span>
        </div>

        <div className="key-reveal-keybox">
          <code className="key-reveal-key">{createdApp?.clientKey}</code>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            leftIcon={copied ? <Check size={14} /> : <Copy size={14} />}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </Modal>
    </div>
>>>>>>> develop
  );
};
