import { NotificationProviderConfig } from '../../../types/notification';

export const MOCK_PROVIDERS: NotificationProviderConfig[] = [
  {
    id: 'prov_sendgrid_acme',
    tenantId: 'tnt_acme',
    applicationId: 'app_marketing_hub',
    name: 'SendGrid Production Email Gateway',
    channel: 'EMAIL',
    providerType: 'SENDGRID',
    isDefault: true,
    isActive: true,
    credentials: { apiKey: 'SG.x891*****************', fromEmail: 'no-reply@acme.com', senderName: 'Acme Global' },
    createdAt: '2026-02-15T09:00:00Z',
  },
  {
    id: 'prov_twilio_acme',
    tenantId: 'tnt_acme',
    applicationId: 'app_auth_alerts',
    name: 'Twilio SMS Primary Provider',
    channel: 'SMS',
    providerType: 'TWILIO',
    isDefault: true,
    isActive: true,
    credentials: { accountSid: 'AC99281****************', messagingServiceSid: 'MG11002233' },
    createdAt: '2026-02-16T11:00:00Z',
  },
  {
    id: 'prov_fcm_paypulse',
    tenantId: 'tnt_fintech',
    applicationId: 'app_paypulse_mobile',
    name: 'Firebase Push Gateway',
    channel: 'PUSH',
    providerType: 'FIREBASE_FCM',
    isDefault: true,
    isActive: true,
    credentials: { projectId: 'paypulse-mobile-prod', serviceAccountKey: '*****' },
    createdAt: '2026-03-10T14:30:00Z',
  },
];

export const providersApi = {
  getProviders: async (tenantId?: string): Promise<NotificationProviderConfig[]> => {
    await new Promise((r) => setTimeout(r, 250));
    if (tenantId) {
      return MOCK_PROVIDERS.filter((p) => p.tenantId === tenantId);
    }
    return MOCK_PROVIDERS;
  },
  createProvider: async (payload: Partial<NotificationProviderConfig>): Promise<NotificationProviderConfig> => {
    const newProv: NotificationProviderConfig = {
      id: 'prov_' + Date.now(),
      tenantId: payload.tenantId || 'tnt_acme',
      applicationId: payload.applicationId,
      name: payload.name || 'New Provider',
      channel: payload.channel || 'EMAIL',
      providerType: payload.providerType || 'SENDGRID',
      isDefault: payload.isDefault || false,
      isActive: true,
      credentials: payload.credentials || {},
      createdAt: new Date().toISOString(),
    };
    MOCK_PROVIDERS.push(newProv);
    return newProv;
  },
};
