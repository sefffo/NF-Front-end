import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Table, Column } from '../../../components/common/Table';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Button } from '../../../components/common/Button';
import { Plus, UserPlus, Edit2 } from 'lucide-react';
import { UserEntity } from '../../../types/user';
import { usersApi } from '../api/usersApi';

export const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    usersApi.getUsers().then((data) => {
      setUsers(data);
      setIsLoading(false);
    });
  }, []);

  const columns: Column<UserEntity>[] = [
    {
      key: 'name',
      header: 'User',
      render: (u) => (
        <div>
          <strong>{u.firstName} {u.lastName}</strong>
          <div className="text-muted text-xs">{u.email}</div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (u) => <span className="badge badge-purple">{u.role}</span>,
    },
    {
      key: 'tenantName',
      header: 'Organization',
      render: (u) => <span>{u.tenantName || 'Global System'}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (u) => <StatusBadge status={u.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (u) => (
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Edit2 size={14} />}
          onClick={() => navigate(`/users/edit/${u.id}`)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="page-container-inner">
      <PageHeader
        title="User Management"
        subtitle="Manage administrative accounts, team members, and role assignments"
        actions={
          <Button variant="primary" leftIcon={<UserPlus size={16} />} onClick={() => navigate('/users/create')}>
            Invite User
          </Button>
        }
      />

      <div className="card">
        <Table columns={columns} data={users} keyExtractor={(u) => u.id} isLoading={isLoading} />
      </div>
    </div>
  );
};
