import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { usersApi } from '../api/usersApi';
import { UserRole } from '../../../types/auth';

export const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<UserRole>('USER');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await usersApi.createUser({ email, firstName, lastName, role });
      navigate('/users');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container-inner">
      <PageHeader title="Invite New User" subtitle="Send an invitation email to add a team member or admin" />

      <div className="card card-padded max-w-xl">
        <form onSubmit={handleSubmit} className="form-stack">
          <div className="form-grid-2col">
            <Input label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            <Input label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>

          <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <div className="input-group">
            <label className="input-label">Assigned System Role</label>
            <select className="input-field" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
              <option value="SUPER_ADMIN">SUPER_ADMIN (Full Global Control)</option>
              <option value="TENANT_ADMIN">TENANT_ADMIN (Workspace Admin)</option>
              <option value="USER">USER (Operator)</option>
            </select>
          </div>

          <Button type="submit" variant="primary" isLoading={isLoading}>
            Send User Invitation
          </Button>
        </form>
      </div>
    </div>
  );
};
