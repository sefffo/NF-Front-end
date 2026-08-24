import React from 'react';
import { PageHeader } from '../../../components/layout/PageHeader';
import { useAuth } from '../../../hooks/useAuth';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="page-container-inner">
      <PageHeader title="User Profile Settings" subtitle="Account credentials, security options, and notification preferences" />

      <div className="card card-padded max-w-xl">
        <div className="profile-header-card mb-6">
          <img src={user?.avatarUrl} alt="Avatar" className="user-avatar-lg" />
          <div>
            <h3>{user?.firstName} {user?.lastName}</h3>
            <span className="badge badge-purple">{user?.role}</span>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="form-stack">
          <div className="form-grid-2col">
            <Input label="First Name" defaultValue={user?.firstName} />
            <Input label="Last Name" defaultValue={user?.lastName} />
          </div>

          <Input label="Email Address" defaultValue={user?.email} disabled />

          <Button type="submit" variant="primary">
            Update Profile Information
          </Button>
        </form>
      </div>
    </div>
  );
};
