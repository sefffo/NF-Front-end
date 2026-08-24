import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { providersApi } from '../api/providersApi';
import { NotificationChannel } from '../../../types/notification';
import { TenantContext } from '../../../app/providers';

export const CreateProviderPage: React.FC = () => {
  const navigate = useNavigate();
  const tenantCtx = useContext(TenantContext);

  const [name, setName] = useState('');
  const [channel, setChannel] = useState<NotificationChannel>('EMAIL');
  const [providerType, setProviderType] = useState('SENDGRID');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await providersApi.createProvider({
        tenantId: tenantCtx?.activeTenant?.id || 'tnt_acme',
        name,
        channel,
        providerType: providerType as any,
        credentials: { apiKey },
        isDefault: true,
      });
      navigate('/providers');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container-inner">
      <PageHeader title="Add Provider Gateway" subtitle="Configure integration keys for email, SMS, push, or webhook servers" />

      <div className="card card-padded max-w-xl">
        <form onSubmit={handleSubmit} className="form-stack">
          <Input
            label="Gateway Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. SendGrid Marketing Mailer"
            required
          />

          <div className="form-grid-2col">
            <div className="input-group">
              <label className="input-label">Channel</label>
              <select className="input-field" value={channel} onChange={(e) => setChannel(e.target.value as NotificationChannel)}>
                <option value="EMAIL">EMAIL</option>
                <option value="SMS">SMS</option>
                <option value="PUSH">PUSH</option>
                <option value="WEBHOOK">WEBHOOK</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Provider Service</label>
              <select className="input-field" value={providerType} onChange={(e) => setProviderType(e.target.value)}>
                <option value="SENDGRID">SendGrid</option>
                <option value="TWILIO">Twilio</option>
                <option value="AWS_SES">AWS SES</option>
                <option value="FIREBASE_FCM">Firebase FCM</option>
                <option value="CUSTOM_WEBHOOK">Custom Webhook</option>
              </select>
            </div>
          </div>

          <Input
            label="API Key / Auth Token"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="SG.xxxxxxxxxxxxxxxxx"
            required
          />

          <Button type="submit" variant="primary" isLoading={isLoading}>
            Save Provider Credentials
          </Button>
        </form>
      </div>
    </div>
  );
};
