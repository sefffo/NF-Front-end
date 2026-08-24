import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Button } from '../../../components/common/Button';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { ArrowLeft, Key, Lock } from 'lucide-react';
import { Application } from '../../../types/application';
import { applicationsApi } from '../api/applicationsApi';

export const ApplicationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [app, setApp] = useState<Application | null>(null);

  useEffect(() => {
    applicationsApi.getApplications().then((apps) => {
      const found = apps.find((a) => a.id === id);
      if (found) setApp(found);
    });
  }, [id]);

  if (!app) return <div className="p-6">Loading application details...</div>;

  return (
    <div className="page-container-inner">
      <PageHeader
        title={app.name}
        subtitle={app.description}
        actions={
          <Button variant="outline" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate('/applications')}>
            Back to Applications
          </Button>
        }
      />

      <div className="card card-padded mt-4">
        <h3>Application Keys</h3>
        <div className="credentials-grid mt-4">
          <div className="credential-box">
            <span className="text-muted"><Key size={14} /> App Key:</span>
            <code>{app.appKey}</code>
          </div>
          <div className="credential-box">
            <span className="text-muted"><Lock size={14} /> App Secret:</span>
            <code>{app.appSecret}</code>
          </div>
        </div>
      </div>
    </div>
  );
};
