import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { usersApi } from '../api/usersApi';
import { UserEntity } from '../../../types/user';
import { UserRole } from '../../../types/auth';

export const EditUserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserEntity | null>(null);
  const [role, setRole] = useState<UserRole>('USER');

  useEffect(() => {
    usersApi.getUsers().then((list) => {
      const found = list.find((u) => u.id === id);
      if (found) {
        setUser(found);
        setRole(found.role);
      }
    });
  }, [id]);

  if (!user) return <div className="p-6">Loading user details...</div>;

  return (
    <div className="page-container-inner">
      <PageHeader title={`Edit User: ${user.firstName} ${user.lastName}`} subtitle={`Email: ${user.email}`} />

      <div className="card card-padded max-w-xl">
        <form onSubmit={(e) => { e.preventDefault(); navigate('/users'); }} className="form-stack">
          <Input label="Email Address" value={user.email} disabled />

          <div className="input-group">
            <label className="input-label">Update Role</label>
            <select className="input-field" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              <option value="TENANT_ADMIN">TENANT_ADMIN</option>
              <option value="USER">USER</option>
            </select>
          </div>

          <Button type="submit" variant="primary">
            Save User Changes
          </Button>
        </form>
      </div>
    </div>
  );
};
