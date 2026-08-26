<<<<<<< HEAD
import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Hash,
  Copy,
  CheckCheck,
  RefreshCw,
  CalendarDays,
  Tag,
  FileText,
  Server,
  Layers,
} from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Button } from '../../../components/common/Button';
import { applicationsApi, ApplicationDto } from '../api/applicationsApi';

// ─── Tiny copy-to-clipboard hook ─────────────────────────────────────────────
function useCopy(ms = 2000) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), ms);
    });
  }, [ms]);
  return { copied, copy };
}

// ─── Skeleton block ───────────────────────────────────────────────────────────
const Skeleton: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = '',
  style,
}) => (
  <div
    className={`skeleton ${className}`}
    style={{ borderRadius: 'var(--radius-sm)', ...style }}
  />
);

// ─── Detail row ───────────────────────────────────────────────────────────────
const DetailRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}> = ({ icon, label, value }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      padding: 'var(--space-3) 0',
      borderBottom: '1px solid var(--color-border)',
    }}
  >
    <span style={{ color: 'var(--color-text-muted)', flexShrink: 0, display: 'flex' }}>{icon}</span>
    <span style={{ color: 'var(--color-text-muted)', minWidth: '11rem', fontSize: 'var(--text-sm)' }}>
      {label}
    </span>
    <span style={{ color: 'var(--color-text)', fontSize: 'var(--text-sm)', wordBreak: 'break-all' }}>
      {value}
    </span>
  </div>
);

// ─── Environment colour map ───────────────────────────────────────────────────
const ENV_COLOR: Record<string, string> = {
  Production: 'var(--color-error)',
  Staging: 'var(--color-warning)',
  Development: 'var(--color-success)',
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export const ApplicationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [app, setApp] = useState<ApplicationDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { copied: copiedAppId, copy: copyAppId } = useCopy();
  const { copied: copiedTenantId, copy: copyTenantId } = useCopy();

  const load = useCallback(
    (quiet = false) => {
      if (!id) return;
      quiet ? setIsRefreshing(true) : setIsLoading(true);
      setError(null);
      applicationsApi
        .getApplicationById(id)
        .then(setApp)
        .catch((err: unknown) => {
          if (axios.isAxiosError(err)) {
            if (err.response?.status === 404) {
              setError('Application not found.');
            } else if (err.response?.status === 403) {
              setError("You don't have permission to view this application.");
            } else {
              setError('Failed to load application details. Please try again.');
            }
          } else {
            setError('An unexpected error occurred.');
          }
        })
        .finally(() => {
          setIsLoading(false);
          setIsRefreshing(false);
        });
    },
    [id],
  );

  useEffect(() => {
    load();
  }, [load]);

  // ── Skeleton loading state ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="page-container-inner">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-6)',
          }}
        >
          <Skeleton style={{ width: 80, height: 32 }} />
          <Skeleton style={{ width: 220, height: 28 }} />
        </div>
        <div className="stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="stat-card">
              <Skeleton style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)' }} />
              <div style={{ flex: 1 }}>
                <Skeleton style={{ width: '60%', height: 12, marginBottom: 6 }} />
                <Skeleton style={{ width: '80%', height: 20 }} />
              </div>
            </div>
          ))}
        </div>
        <div className="card card-padded">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} style={{ height: 40, marginBottom: 8 }} />
          ))}
        </div>
      </div>
    );
  }

  // ── Error / 404 state ─────────────────────────────────────────────────────
  if (error || !app) {
    return (
      <div className="page-container-inner">
        <PageHeader
          title="Application Details"
          actions={
            <Button
              variant="outline"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          }
        />
        <div role="alert" className="alert alert-error">
          {error ?? 'Application not found.'}
        </div>
      </div>
    );
  }

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const envColor = ENV_COLOR[app.environment] ?? 'var(--color-text-muted)';

  return (
    <div className="page-container-inner">
      {/* ── Header ── */}
      <PageHeader
        title={app.name}
        subtitle={app.description ?? `Slug: ${app.slug}`}
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={
                isRefreshing ? (
                  <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <RefreshCw size={14} />
                )
              }
              onClick={() => load(true)}
              disabled={isRefreshing}
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </div>
        }
      />

      {/* ── Stats row ── */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-card">
          <div className="stat-icon icon-blue">
            <Layers size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Status</span>
            <StatusBadge status={app.status} label={app.status} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-surface-offset)' }}>
            <Server size={20} style={{ color: envColor }} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Environment</span>
            <span
              className="stat-value"
              style={{ color: envColor, fontSize: 'var(--text-sm)', fontWeight: 600 }}
            >
              {app.environment}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-emerald">
            <CalendarDays size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Registered</span>
            <span className="stat-value" style={{ fontSize: 'var(--text-xs)' }}>
              {fmt(app.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Application details ── */}
      <div className="card card-padded" style={{ marginBottom: 'var(--space-4)' }}>
        <h3 style={{ marginBottom: 'var(--space-1)', fontSize: 'var(--text-lg)' }}>
          Application Details
        </h3>
        <p
          style={{
            color: 'var(--color-text-muted)',
            fontSize: 'var(--text-sm)',
            marginBottom: 'var(--space-4)',
          }}
        >
          Configuration and metadata for this application
        </p>

        <DetailRow
          icon={<Tag size={16} />}
          label="Slug"
          value={<code style={{ fontSize: 'var(--text-xs)' }}>{app.slug}</code>}
        />

        <DetailRow
          icon={<Server size={16} />}
          label="Environment"
          value={
            <span style={{ color: envColor, fontWeight: 600 }}>{app.environment}</span>
          }
        />

        <DetailRow
          icon={<Layers size={16} />}
          label="Status"
          value={<StatusBadge status={app.status} label={app.status} />}
        />

        {app.description && (
          <DetailRow
            icon={<FileText size={16} />}
            label="Description"
            value={app.description}
          />
        )}

        <DetailRow
          icon={<CalendarDays size={16} />}
          label="Created"
          value={fmt(app.createdAt)}
        />

        <DetailRow
          icon={<CalendarDays size={16} />}
          label="Last Updated"
          value={fmt(app.updatedAt)}
        />
      </div>

      {/* ── Identity ── */}
      <div className="card card-padded">
        <h3 style={{ marginBottom: 'var(--space-1)', fontSize: 'var(--text-lg)' }}>
          Identity
        </h3>
        <p
          style={{
            color: 'var(--color-text-muted)',
            fontSize: 'var(--text-sm)',
            marginBottom: 'var(--space-4)',
          }}
        >
          Immutable identifiers — use these when calling the Notification API
        </p>

        <DetailRow
          icon={<Hash size={16} />}
          label="Application ID"
          value={
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <code style={{ fontSize: 'var(--text-xs)' }}>{app.applicationId}</code>
              <button
                type="button"
                aria-label="Copy application ID"
                onClick={() => copyAppId(app.applicationId)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: copiedAppId ? 'var(--color-success)' : 'var(--color-text-muted)',
                  display: 'flex',
                  padding: 'var(--space-1)',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'color var(--transition-interactive)',
                }}
              >
                {copiedAppId ? <CheckCheck size={14} /> : <Copy size={14} />}
              </button>
            </div>
          }
        />

        <DetailRow
          icon={<Hash size={16} />}
          label="Tenant ID"
          value={
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <code style={{ fontSize: 'var(--text-xs)' }}>{app.tenantId}</code>
              <button
                type="button"
                aria-label="Copy tenant ID"
                onClick={() => copyTenantId(app.tenantId)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: copiedTenantId ? 'var(--color-success)' : 'var(--color-text-muted)',
                  display: 'flex',
                  padding: 'var(--space-1)',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'color var(--transition-interactive)',
                }}
              >
                {copiedTenantId ? <CheckCheck size={14} /> : <Copy size={14} />}
              </button>
            </div>
          }
        />
=======
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Button } from '../../../components/common/Button';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { ArrowLeft, Key, Lock } from 'lucide-react';
import { Application } from '../../../types/application';
import { applicationsApi } from '../api/applicationsApi';

export const ApplicationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [app, setApp] = useState<Application | null>(null);

  useEffect(() => {
    applicationsApi.getApplications().then((apps) => {
      const found = apps.find((a) => a.id === id);
      if (found) setApp(found);
    });
  }, [id]);

  if (!app) return <div className="p-6">Loading application details...</div>;

  return (
    <div className="page-container-inner">
      <PageHeader
        title={app.name}
        subtitle={app.description}
        actions={
          <Button variant="outline" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate('/applications')}>
            Back to Applications
          </Button>
        }
      />

      <div className="card card-padded mt-4">
        <h3>Application Keys</h3>
        <div className="credentials-grid mt-4">
          <div className="credential-box">
            <span className="text-muted"><Key size={14} /> App Key:</span>
            <code>{app.appKey}</code>
          </div>
          <div className="credential-box">
            <span className="text-muted"><Lock size={14} /> App Secret:</span>
            <code>{app.appSecret}</code>
          </div>
        </div>
>>>>>>> develop
      </div>
    </div>
  );
};
