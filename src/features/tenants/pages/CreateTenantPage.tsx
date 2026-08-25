import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PageHeader } from '../../../components/layout/PageHeader';
import { TenantForm } from '../components/TenantForm';
import { tenantsApi } from '../api/tenantsApi';
import { CreateTenantPayload } from '../../../types/tenant';

// Maps HTTP status codes to user-facing messages per Task 14 spec
function resolveErrorMessage(status: number, data: unknown): string {
  if (status === 403) {
    return "You don't have permission to create a tenant.";
  }
  if (status === 409) {
    return 'A tenant with this name or code already exists.';
  }
  if (status === 400) {
    // Try to surface the first validation message from the backend
    if (data && typeof data === 'object') {
      const d = data as Record<string, unknown>;
      // Common shapes: { errors: { field: ["msg"] } } or { message: "..." }
      if (d.errors && typeof d.errors === 'object') {
        const firstField = Object.values(d.errors as Record<string, string[]>)[0];
        if (Array.isArray(firstField) && firstField.length > 0) return firstField[0];
      }
      if (typeof d.message === 'string') return d.message;
      if (typeof d.title === 'string') return d.title;
    }
    return 'Validation failed. Please check your inputs and try again.';
  }
  return 'Something went wrong. Please try again.';
}

export const CreateTenantPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (payload: CreateTenantPayload) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await tenantsApi.createTenant(payload);
      navigate('/tenants');
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setServerError(resolveErrorMessage(err.response.status, err.response.data));
      } else {
        setServerError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container-inner">
      <PageHeader
        title="Provision New Tenant"
        subtitle="Register a new organization workspace with custom API limits"
      />

      <div className="card card-padded max-w-2xl">
        <TenantForm onSubmit={handleSubmit} isLoading={isLoading} serverError={serverError} />
      </div>
    </div>
  );
};
