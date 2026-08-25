import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Building2,
  AppWindow,
  Users,
  Bell,
  Mail,
  Globe,
  Hash,
  Copy,
  CheckCheck,
  RefreshCw,
  CalendarDays,
} from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Button } from '../../../components/common/Button';
import { tenantsApi, TenantDto } from '../api/tenantsApi';

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
const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`skeleton ${className}`} style={{ borderRadius: 'var(--radius-sm)' }} />
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

// ─── Quota bar ────────────────────────────────────────────────────────────────
const QuotaBar: React.FC<{ used: number; max: number; label: string }> = ({ used, max, label }) => {
  const pct = max > 0 ? Math.min(100, Math.round((used / max) * 100)) : 0;
  const color =
    pct >= 90 ? 'var(--color-error)' : pct >= 70 ? 'var(--color-warning)' : 'var(--color-primary)';
  return (
    <div style={{ marginTop: 'var(--space-2)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-muted)',
          marginBottom: 'var(--space-1)',
        }}
      >
        <span>{label}</span>
        <span>
          {used} / {max}
        </span>
      </div>
      <div
        style={{
          height: 6,
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-surface-offset)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: color,
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.4s ease',
          }}
        />
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export const TenantDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [tenant, setTenant] = useState<TenantDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { copied: copiedId, copy: copyId } = useCopy();

  const load = useCallback(
    (quiet = false) => {
      if (!id) return;
      quiet ? setIsRefreshing(true) : setIsLoading(true);
      setError(null);
      tenantsApi
        .getTenantById(id)
        .then(setTenant)
        .catch((err: unknown) => {
          if (axios.isAxiosError(err)) {
            if (err.response?.status === 404) {
              setError('Tenant not found.');
            } else if (err.response?.status === 403) {
              setError("You don't have permission to view this tenant.");
            } else {
              setError('Failed to load tenant details. Please try again.');
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
          <Skeleton className="skeleton-text" style={{ width: 80, height: 32 }} />
          <Skeleton className="skeleton-heading" style={{ width: 220, height: 28 }} />
        </div>
        <div className="stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="stat-card">
              <Skeleton style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)' }} />
              <div style={{ flex: 1 }}>
                <Skeleton className="skeleton-text" style={{ width: '60%', height: 12 }} />
                <Skeleton className="skeleton-text" style={{ width: '80%', height: 20 }} />
              </div>
            </div>
          ))}
        </div>
        <div className="card card-padded">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="skeleton-text" style={{ height: 40, marginBottom: 8 }} />
          ))}
        </div>
      </div>
    );
  }

  // ── Error / 404 state ─────────────────────────────────────────────────────
  if (error || !tenant) {
    return (
      <div className="page-container-inner">
        <PageHeader
          title="Tenant Details"
          actions={
            <Button
              variant="outline"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => navigate('/tenants')}
            >
              Back to Tenants
            </Button>
          }
        />
        <div role="alert" className="alert alert-error">
          {error ?? 'Tenant not found.'}
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

  return (
    <div className="page-container-inner">
      {/* ── Header ── */}
      <PageHeader
        title={tenant.name}
        subtitle={`Slug: ${tenant.slug}`}
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
              onClick={() => navigate('/tenants')}
            >
              Back to Tenants
            </Button>
          </div>
        }
      />

      {/* ── Stats row ── */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-card">
          <div className="stat-icon icon-purple">
            <Building2 size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Status</span>
            <StatusBadge status={tenant.status} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-blue">
            <AppWindow size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Applications</span>
            <span className="stat-value">
              {tenant.applicationCount} / {tenant.maxAllowedApplications}
            </span>
            <QuotaBar
              used={tenant.applicationCount}
              max={tenant.maxAllowedApplications}
              label="Used"
            />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-emerald">
            <Users size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Users</span>
            <span className="stat-value">{tenant.userCount} Active</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-amber">
            <Bell size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Daily Notifications</span>
            <span className="stat-value">
              {tenant.maxDailyNotifications.toLocaleString()} / day
            </span>
          </div>
        </div>
      </div>

      {/* ── Configuration ── */}
      <div className="card card-padded" style={{ marginBottom: 'var(--space-4)' }}>
        <h3 style={{ marginBottom: 'var(--space-1)', fontSize: 'var(--text-lg)' }}>
          Configuration
        </h3>
        <p
          style={{
            color: 'var(--color-text-muted)',
            fontSize: 'var(--text-sm)',
            marginBottom: 'var(--space-4)',
          }}
        >
          Tenant-level settings and contact information
        </p>

        <DetailRow
          icon={<Mail size={16} />}
          label="Support Email"
          value={
            tenant.supportEmail ? (
              <a href={`mailto:${tenant.supportEmail}`} style={{ color: 'var(--color-primary)' }}>
                {tenant.supportEmail}
              </a>
            ) : (
              <span style={{ color: 'var(--color-text-faint)' }}>Not configured</span>
            )
          }
        />

        <DetailRow
          icon={<Globe size={16} />}
          label="Custom Domain"
          value={
            tenant.customDomain ?? (
              <span style={{ color: 'var(--color-text-faint)' }}>Not configured</span>
            )
          }
        />

        <DetailRow
          icon={<Bell size={16} />}
          label="Max Daily Notifications"
          value={tenant.maxDailyNotifications.toLocaleString()}
        />

        <DetailRow
          icon={<AppWindow size={16} />}
          label="Max Applications"
          value={tenant.maxAllowedApplications}
        />

        <DetailRow
          icon={<CalendarDays size={16} />}
          label="Created"
          value={fmt(tenant.createdAt)}
        />

        <DetailRow
          icon={<CalendarDays size={16} />}
          label="Last Updated"
          value={fmt(tenant.updatedAt)}
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
          Immutable identifiers for this tenant
        </p>

        <DetailRow
          icon={<Hash size={16} />}
          label="Tenant ID"
          value={
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <code style={{ fontSize: 'var(--text-xs)' }}>{tenant.tenantId}</code>
              <button
                type="button"
                aria-label="Copy tenant ID"
                onClick={() => copyId(tenant.tenantId)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: copiedId ? 'var(--color-success)' : 'var(--color-text-muted)',
                  display: 'flex',
                  padding: 'var(--space-1)',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'color var(--transition-interactive)',
                }}
              >
                {copiedId ? <CheckCheck size={14} /> : <Copy size={14} />}
              </button>
            </div>
          }
        />

        <DetailRow
          icon={<Hash size={16} />}
          label="Slug"
          value={<code style={{ fontSize: 'var(--text-xs)' }}>{tenant.slug}</code>}
        />
      </div>
    </div>
  );
};
