import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  AppWindow,
  Users,
  ShieldAlert,
  Radio,
  Send,
  Bell,
  History,
  User,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { can, isSuperAdmin } = usePermissions();

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      show: true,
    },
    {
      label: 'Tenants',
      path: '/tenants',
      icon: Building2,
      show: isSuperAdmin,
    },
    {
      label: 'Applications',
      path: '/applications',
      icon: AppWindow,
      show: can('canManageApplications'),
    },
    {
      label: 'Send Notification',
      path: '/notifications/send',
      icon: Send,
      show: can('canSendNotifications'),
    },
    {
      label: 'Notifications',
      path: '/notifications',
      icon: Bell,
      show: true,
    },
    {
      label: 'Dispatch History',
      path: '/notifications/history',
      icon: History,
      show: can('canViewHistory'),
    },
    {
      label: 'Providers',
      path: '/providers',
      icon: Radio,
      show: can('canConfigureProviders'),
    },
    {
      label: 'Users',
      path: '/users',
      icon: Users,
      show: can('canManageUsers'),
    },
    {
      label: 'Roles & Perms',
      path: '/roles',
      icon: ShieldAlert,
      show: can('canManageRoles'),
    },
    {
      label: 'My Profile',
      path: '/profile',
      icon: User,
      show: true,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <Bell className="brand-icon" />
        </div>
        <div className="brand-info">
          <span className="brand-title">NotifyCore</span>
          <span className="brand-subtitle">Enterprise Engine</span>
        </div>
      </div>

      <div className="sidebar-nav">
        <div className="nav-section-label">NAVIGATION</div>
        {navItems
          .filter((item) => item.show)
          .map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                end={item.path === '/notifications'}
              >
                <Icon size={18} className="nav-link-icon" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
      </div>

      <div className="sidebar-footer">
        <div className="user-profile-summary">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt="User avatar"
            className="user-avatar"
          />
          <div className="user-info">
            <span className="user-name">{user?.firstName} {user?.lastName}</span>
            <span className="user-role-badge">{user?.role}</span>
          </div>
        </div>
        <button className="btn-logout" onClick={logout} title="Sign Out">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};
