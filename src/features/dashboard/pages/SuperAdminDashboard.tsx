import React from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Building2, AppWindow, Send, ShieldAlert, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/common/Button';

export const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Super Admin Control Center"
        subtitle="Global multi-tenant metrics, infrastructure health, and system dispatches"
        actions={
          <Button variant="primary" leftIcon={<Send size={16} />} onClick={() => navigate('/notifications/send')}>
            Dispatch Notification
          </Button>
        }
      />

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon icon-purple">
            <Building2 size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Tenants</span>
            <span className="stat-value">3</span>
            <span className="stat-trend positive"><ArrowUpRight size={14} /> +12.5% this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-blue">
            <AppWindow size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Active Applications</span>
            <span className="stat-value">7</span>
            <span className="stat-trend positive"><ArrowUpRight size={14} /> +3 new registered</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-emerald">
            <Send size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Notifications Sent (24h)</span>
            <span className="stat-value">4,521,400</span>
            <span className="stat-trend positive"><ArrowUpRight size={14} /> 99.8% delivery rate</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-amber">
            <ShieldAlert size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Failed Delivery Retries</span>
            <span className="stat-value">142</span>
            <span className="stat-trend neutral">Normal threshold</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid-2col">
        <div className="card">
          <div className="card-header">
            <h3>System Provider Health</h3>
          </div>
          <div className="card-body">
            <div className="provider-status-list">
              <div className="status-item">
                <div className="status-item-info">
                  <CheckCircle2 size={18} className="text-success" />
                  <div>
                    <strong>SendGrid Email Gateway</strong>
                    <p className="text-muted">Avg latency: 240ms</p>
                  </div>
                </div>
                <span className="badge badge-success">OPERATIONAL</span>
              </div>

              <div className="status-item">
                <div className="status-item-info">
                  <CheckCircle2 size={18} className="text-success" />
                  <div>
                    <strong>Twilio SMS Gateway</strong>
                    <p className="text-muted">Avg latency: 410ms</p>
                  </div>
                </div>
                <span className="badge badge-success">OPERATIONAL</span>
              </div>

              <div className="status-item">
                <div className="status-item-info">
                  <AlertCircle size={18} className="text-warning" />
                  <div>
                    <strong>Firebase FCM Push</strong>
                    <p className="text-muted">Minor delivery queue backlog</p>
                  </div>
                </div>
                <span className="badge badge-warning">DEGRADED</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Recent System Activity</h3>
          </div>
          <div className="card-body">
            <ul className="activity-feed">
              <li>
                <span className="activity-bullet bullet-primary"></span>
                <div>
                  <p>New tenant <strong>Acme Global Inc.</strong> created</p>
                  <small className="text-muted">Today at 08:30 AM</small>
                </div>
              </li>
              <li>
                <span className="activity-bullet bullet-success"></span>
                <div>
                  <p>Twilio SMS provider credentials updated for <strong>PayPulse</strong></p>
                  <small className="text-muted">Today at 11:15 AM</small>
                </div>
              </li>
              <li>
                <span className="activity-bullet bullet-amber"></span>
                <div>
                  <p>High throughput batch alert dispatched (1.2M push tokens)</p>
                  <small className="text-muted">Yesterday at 04:20 PM</small>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
