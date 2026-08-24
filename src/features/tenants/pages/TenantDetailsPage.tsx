import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Button } from '../../../components/common/Button';
import { Key, ArrowLeft, Building2, AppWindow, Users } from 'lucide-react';
import { Tenant } from '../../../types/tenant';
import { tenantsApi } from '../api/tenantsApi';

export const TenantDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    if (id) {
      tenantsApi.getTenantById(id).then((t) => setTenant(t || null));
    }
  }, [id]);

  if (!tenant) {
    return <div className="p-6">Loading tenant details...</div>;
  }

  return (
    <div className="page-container-inner">
      <PageHeader
        title={tenant.name}
        subtitle={`Tenant ID: ${tenant.id} • Slug: ${tenant.slug}`}
        actions={
          <Button variant="outline" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate('/tenants')}>
            Back to Tenants
          </Button>
        }
      />

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon icon-purple"><Building2 size={20} /></div>
          <div className="stat-content">
            <span className="stat-label">Status</span>
            <StatusBadge status={tenant.status} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-blue"><AppWindow size={20} /></div>
          <div className="stat-content">
            <span className="stat-label">Applications</span>
            <span className="stat-value">{tenant.applicationsCount} / {tenant.settings.maxApplications}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-emerald"><Users size={20} /></div>
          <div className="stat-content">
            <span className="stat-label">Users</span>
            <span className="stat-value">{tenant.usersCount} Active</span>
          </div>
        </div>
      </div>

      <div className="card card-padded mt-6">
        <h3>API & Security Keys</h3>
        <div className="api-key-box mt-3">
          <span>Master API Key:</span>
          <code>{tenant.apiKey}</code>
          <Button variant="ghost" size="sm" leftIcon={<Key size={14} />}>
            Rotate Key
          </Button>
        </div>
      </div>
    </div>
  );
};
