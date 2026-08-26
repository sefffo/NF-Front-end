import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import axios from 'axios';
import { PageHeader } from '../../../components/layout/PageHeader';
import { TenantForm } from '../components/TenantForm';
import { tenantsApi, CreateTenantResponse } from '../api/tenantsApi';
import { CreateTenantPayload } from '../../../types/tenant';

// ─── API Key reveal modal ─────────────────────────────────────────────────────
// The backend returns the plain-text apiKey only once on creation.
// We display it in a modal so the user can copy it before navigating away.
const ApiKeyModal: React.FC<{
  apiKey: string;
  tenantName: string;
  onDismiss: () => void;
}> = ({ apiKey, tenantName, onDismiss }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 'var(--space-4)',
      }}
    >
      <div
        className="card card-padded"
        style={{ maxWidth: 520, width: '100%', background: 'var(--color-surface)' }}
      >
        <h2
          id="api-key-modal-title"
          style={{ marginBottom: 'var(--space-2)', fontSize: 'var(--text-xl)' }}
        >
          Tenant Created
        </h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
          <strong>{tenantName}</strong> has been provisioned. Copy the API key below — it
          will not be shown again.
        </p>

        <div
          className="alert alert-warning"
          style={{ marginBottom: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}
        >
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            API Key (one-time)
          </span>
          <code
            style={{
              wordBreak: 'break-all',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text)',
            }}
          >
            {apiKey}
          </code>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleCopy}
            style={{ minWidth: 100 }}
          >
            {copied ? '✓ Copied' : 'Copy Key'}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onDismiss}
            style={{ minWidth: 120 }}
          >
            Go to Tenants
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Error message resolver ───────────────────────────────────────────────────
function resolveErrorMessage(status: number, data: unknown): string {
  if (status === 403) return "You don't have permission to create a tenant.";
  if (status === 409) return 'A tenant with this name already exists.';
  if (status === 400) {
    if (data && typeof data === 'object') {
      const d = data as Record<string, unknown>;
      if (d.errors && typeof d.errors === 'object') {
        const firstField = Object.values(d.errors as Record<string, string[]>)[0];
        if (Array.isArray(firstField) && firstField.length > 0) return firstField[0];
      }
      if (typeof d.message === 'string') return d.message;
      if (typeof d.title === 'string') return d.title;
    }
    return 'Validation failed. Please check your inputs and try again.';
  }
  return 'Something went wrong. Please try again.';
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export const CreateTenantPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  // Holds the one-time API key from the creation response
  const [createdTenant, setCreatedTenant] = useState<CreateTenantResponse | null>(null);

  const handleSubmit = async (payload: CreateTenantPayload) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const result = await tenantsApi.createTenant(payload);
      // Show the API key modal before navigating away
      setCreatedTenant(result);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setServerError(resolveErrorMessage(err.response.status, err.response.data));
      } else {
        setServerError('An unexpected error occurred. Please try again.');
      }
=======
import { PageHeader } from '../../../components/layout/PageHeader';
import { TenantForm } from '../components/TenantForm';
import { tenantsApi } from '../api/tenantsApi';
import { CreateTenantPayload } from '../../../types/tenant';

export const CreateTenantPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (payload: CreateTenantPayload) => {
    setIsLoading(true);
    try {
      await tenantsApi.createTenant(payload);
      navigate('/tenants');
>>>>>>> develop
    } finally {
      setIsLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <>
      {createdTenant && (
        <ApiKeyModal
          apiKey={createdTenant.apiKey}
          tenantName={createdTenant.name}
          onDismiss={() => navigate('/tenants')}
        />
      )}

      <div className="page-container-inner">
        <PageHeader
          title="Provision New Tenant"
          subtitle="Register a new organization workspace with custom API limits"
        />

        <div className="card card-padded max-w-2xl">
          <TenantForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            serverError={serverError}
          />
        </div>
      </div>
    </>
=======
    <div className="page-container-inner">
      <PageHeader title="Provision New Tenant" subtitle="Register a new organization workspace with custom API limits" />

      <div className="card card-padded max-w-2xl">
        <TenantForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
>>>>>>> develop
  );
};
