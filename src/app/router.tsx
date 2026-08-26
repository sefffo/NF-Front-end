import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../guards/ProtectedRoute';
import { RoleGuard } from '../guards/RoleGuard';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../hooks/useAuth';

// Feature Pages
import { LoginPage } from '../features/auth/pages/LoginPage';
import { SuperAdminDashboard } from '../features/dashboard/pages/SuperAdminDashboard';
import { TenantAdminDashboard } from '../features/dashboard/pages/TenantAdminDashboard';
import { UserDashboard } from '../features/dashboard/pages/UserDashboard';

import { TenantsPage } from '../features/tenants/pages/TenantsPage';
import { CreateTenantPage } from '../features/tenants/pages/CreateTenantPage';
import { TenantDetailsPage } from '../features/tenants/pages/TenantDetailsPage';

import { ApplicationsPage } from '../features/applications/pages/ApplicationsPage';
import { CreateApplicationPage } from '../features/applications/pages/CreateApplicationPage';
import { ApplicationDetailsPage } from '../features/applications/pages/ApplicationDetailsPage';

import { UsersPage } from '../features/users/pages/UsersPage';
import { CreateUserPage } from '../features/users/pages/CreateUserPage';
import { EditUserPage } from '../features/users/pages/EditUserPage';

import { RolesPage } from '../features/roles/pages/RolesPage';

import { ProviderConfigurationsPage } from '../features/providers/pages/ProviderConfigurationsPage';
import { CreateProviderPage } from '../features/providers/pages/CreateProviderPage';

import { SendNotificationPage } from '../features/notifications/pages/SendNotificationPage';
<<<<<<< HEAD
import { SendEmailPage } from '../features/notifications/pages/SendEmailPage';
=======
>>>>>>> develop
import { NotificationsPage } from '../features/notifications/pages/NotificationsPage';
import { NotificationDetailsPage } from '../features/notifications/pages/NotificationDetailsPage';
import { NotificationHistoryPage } from '../features/notifications/pages/NotificationHistoryPage';

import { ProfilePage } from '../features/profile/pages/ProfilePage';

<<<<<<< HEAD
// ─── Route to the correct dashboard based on the logged-in user's role ────────
const DashboardRoleRouter: React.FC = () => {
  const { user } = useAuth();
  if (user?.role === 'SUPER_ADMIN')  return <SuperAdminDashboard />;
=======
// Component to dynamically route to role-appropriate dashboard
const DashboardRoleRouter: React.FC = () => {
  const { user } = useAuth();
  if (user?.role === 'SUPER_ADMIN') return <SuperAdminDashboard />;
>>>>>>> develop
  if (user?.role === 'TENANT_ADMIN') return <TenantAdminDashboard />;
  return <UserDashboard />;
};

<<<<<<< HEAD
// ─── Block authenticated users from reaching the login page again ─────────────
=======
// Redirect authenticated users away from the login page
>>>>>>> develop
const PublicOnlyRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : element;
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
<<<<<<< HEAD
        {/* ── Public ────────────────────────────────────────────────────────── */}
        <Route path="/login" element={<PublicOnlyRoute element={<LoginPage />} />} />

        {/* ── Protected (must be logged in) ────────────────────────────────── */}
=======
        {/* Public Routes */}
        <Route path="/login" element={<PublicOnlyRoute element={<LoginPage />} />} />

        {/* Protected Dashboard Layout */}
>>>>>>> develop
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardRoleRouter />} />

<<<<<<< HEAD
            {/* Tenants — GlobalAdmin (SUPER_ADMIN) only */}
            <Route element={<RoleGuard allowedRoles={['SUPER_ADMIN']} />}>
              <Route path="/tenants"        element={<TenantsPage />} />
              <Route path="/tenants/create" element={<CreateTenantPage />} />
              <Route path="/tenants/:id"    element={<TenantDetailsPage />} />
            </Route>

            {/* Applications — GlobalAdmin + TenantAdmin */}
            <Route element={<RoleGuard allowedRoles={['SUPER_ADMIN', 'TENANT_ADMIN']} />}>
              <Route path="/applications"        element={<ApplicationsPage />} />
              <Route path="/applications/create" element={<CreateApplicationPage />} />
              <Route path="/applications/:id"    element={<ApplicationDetailsPage />} />
            </Route>

            {/* Users — GlobalAdmin + TenantAdmin */}
            <Route element={<RoleGuard allowedRoles={['SUPER_ADMIN', 'TENANT_ADMIN']} />}>
              <Route path="/users"          element={<UsersPage />} />
              <Route path="/users/create"   element={<CreateUserPage />} />
              <Route path="/users/edit/:id" element={<EditUserPage />} />
            </Route>

            {/* Roles — GlobalAdmin only */}
=======
            {/* Tenants (Super Admin only) */}
            <Route element={<RoleGuard allowedRoles={['SUPER_ADMIN']} />}>
              <Route path="/tenants" element={<TenantsPage />} />
              <Route path="/tenants/create" element={<CreateTenantPage />} />
              <Route path="/tenants/:id" element={<TenantDetailsPage />} />
            </Route>

            {/* Applications (Super Admin & Tenant Admin) */}
            <Route element={<RoleGuard allowedRoles={['SUPER_ADMIN', 'TENANT_ADMIN']} />}>
              <Route path="/applications" element={<ApplicationsPage />} />
              <Route path="/applications/create" element={<CreateApplicationPage />} />
              <Route path="/applications/:id" element={<ApplicationDetailsPage />} />
            </Route>

            {/* Users (Super Admin & Tenant Admin) */}
            <Route element={<RoleGuard allowedRoles={['SUPER_ADMIN', 'TENANT_ADMIN']} />}>
              <Route path="/users" element={<UsersPage />} />
              <Route path="/users/create" element={<CreateUserPage />} />
              <Route path="/users/edit/:id" element={<EditUserPage />} />
            </Route>

            {/* Roles (Super Admin) */}
>>>>>>> develop
            <Route element={<RoleGuard allowedRoles={['SUPER_ADMIN']} />}>
              <Route path="/roles" element={<RolesPage />} />
            </Route>

<<<<<<< HEAD
            {/* Provider Configurations — GlobalAdmin + TenantAdmin */}
            <Route element={<RoleGuard allowedRoles={['SUPER_ADMIN', 'TENANT_ADMIN']} />}>
              <Route path="/providers"        element={<ProviderConfigurationsPage />} />
              <Route path="/providers/create" element={<CreateProviderPage />} />
            </Route>

            {/* Notifications — all authenticated roles */}
            <Route path="/notifications"            element={<NotificationsPage />} />
            <Route path="/notifications/send"        element={<SendNotificationPage />} />
            <Route path="/notifications/send-email"  element={<SendEmailPage />} />
            <Route path="/notifications/history"     element={<NotificationHistoryPage />} />
            <Route path="/notifications/:id"         element={<NotificationDetailsPage />} />
=======
            {/* Provider Configurations (Super Admin & Tenant Admin) */}
            <Route element={<RoleGuard allowedRoles={['SUPER_ADMIN', 'TENANT_ADMIN']} />}>
              <Route path="/providers" element={<ProviderConfigurationsPage />} />
              <Route path="/providers/create" element={<CreateProviderPage />} />
            </Route>

            {/* Notifications (Accessible to all authenticated users) */}
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/notifications/send" element={<SendNotificationPage />} />
            <Route path="/notifications/history" element={<NotificationHistoryPage />} />
            <Route path="/notifications/:id" element={<NotificationDetailsPage />} />
>>>>>>> develop

            {/* Profile */}
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

<<<<<<< HEAD
        {/* ── Fallback ─────────────────────────────────────────────────────── */}
=======
        {/* Fallback */}
>>>>>>> develop
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
