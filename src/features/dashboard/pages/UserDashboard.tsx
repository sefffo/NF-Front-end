import React from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Send, History, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/common/Button';

export const UserDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Notification Operator Console"
        subtitle="Quick notification dispatch, template overview, and delivery status tracking"
        actions={
          <Button variant="primary" onClick={() => navigate('/notifications/send')} leftIcon={<Send size={16} />}>
            New Dispatch
          </Button>
        }
      />

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon icon-emerald">
            <CheckCircle size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Successful Dispatches</span>
            <span className="stat-value">1,240</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-amber">
            <Clock size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Scheduled Messages</span>
            <span className="stat-value">12 Pending</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-blue">
            <History size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Volume</span>
            <span className="stat-value">1,252</span>
          </div>
        </div>
      </div>
    </div>
  );
};
