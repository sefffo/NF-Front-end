import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { applicationsApi } from '../api/applicationsApi';
import { AppEnvironment } from '../../../types/application';
import { TenantContext } from '../../../app/providers';

export const CreateApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const tenantCtx = useContext(TenantContext);

  const [name, setName] = useState('');
  const [environment, setEnvironment] = useState<AppEnvironment>('DEVELOPMENT');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await applicationsApi.createApplication({
        tenantId: tenantCtx?.activeTenant?.id || 'tnt_acme',
        name,
        environment,
        description,
      });
      navigate('/applications');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container-inner">
      <PageHeader title="Register Application" subtitle="Generate App Key and Secret credentials for a new client service" />

      <div className="card card-padded max-w-xl">
        <form onSubmit={handleSubmit} className="form-stack">
          <Input
            label="Application Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Acme Marketing Engine"
            required
          />

          <div className="input-group">
            <label className="input-label">Environment</label>
            <select
              className="input-field"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value as AppEnvironment)}
            >
              <option value="DEVELOPMENT">DEVELOPMENT</option>
              <option value="STAGING">STAGING</option>
              <option value="PRODUCTION">PRODUCTION</option>
            </select>
          </div>

          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief purpose of this application..."
          />

          <Button type="submit" variant="primary" isLoading={isLoading}>
            Generate App Credentials
          </Button>
        </form>
      </div>
    </div>
  );
};
