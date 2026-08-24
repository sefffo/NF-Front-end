import React, { useContext } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { AppWindow, Send, Radio, Users, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/common/Button';
import { TenantContext } from '../../../app/providers';

export const TenantAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const tenantCtx = useContext(TenantContext);
  const currentTenant = tenantCtx?.activeTenant;

  return (
    <div className="dashboard-page">
      <PageHeader
        title={`${currentTenant?.name || 'Tenant'} Workspace`}
        subtitle="Manage registered applications, notification providers, and team access"
        actions={
          <div className="button-group">
            <Button variant="outline" onClick={() => navigate('/applications/create')} leftIcon={<Plus size={16} />}>
              New Application
            </Button>
            <Button variant="primary" onClick={() => navigate('/notifications/send')} leftIcon={<Send size={16} />}>
              Send Notification
            </Button>
          </div>
        }
      />

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon icon-blue">
            <AppWindow size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Applications</span>
            <span className="stat-value">{currentTenant?.applicationsCount || 4}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-emerald">
            <Send size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Messages Dispatched</span>
            <span className="stat-value">2,310,900</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-purple">
            <Radio size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Active Providers</span>
            <span className="stat-value">3 Configured</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-amber">
            <Users size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Team Members</span>
            <span className="stat-value">{currentTenant?.usersCount || 18}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
