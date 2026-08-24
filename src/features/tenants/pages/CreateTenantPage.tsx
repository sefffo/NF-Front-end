import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { TenantForm } from '../components/TenantForm';
import { tenantsApi } from '../api/tenantsApi';
import { CreateTenantPayload } from '../../../types/tenant';

export const CreateTenantPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (payload: CreateTenantPayload) => {
    setIsLoading(true);
    try {
      await tenantsApi.createTenant(payload);
      navigate('/tenants');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container-inner">
      <PageHeader title="Provision New Tenant" subtitle="Register a new organization workspace with custom API limits" />

      <div className="card card-padded max-w-2xl">
        <TenantForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};
