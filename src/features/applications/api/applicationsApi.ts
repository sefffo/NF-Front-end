import { Application, CreateApplicationPayload } from '../../../types/application';

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app_marketing_hub',
    tenantId: 'tnt_acme',
    name: 'Acme Marketing Engine',
    appKey: 'ak_prod_acme_marketing_9912',
    appSecret: 'sec_live_998877665544332211',
    environment: 'PRODUCTION',
    description: 'Handles promotional emails, product update notifications, and newsletters.',
    activeProvidersCount: 3,
    totalNotificationsSent: 1420500,
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-08-11T16:45:00Z',
  },
  {
    id: 'app_auth_alerts',
    tenantId: 'tnt_acme',
    name: 'Acme Auth & Security Alerts',
    appKey: 'ak_prod_acme_auth_4411',
    appSecret: 'sec_live_112233445566778899',
    environment: 'PRODUCTION',
    description: 'Critical 2FA SMS verification codes and security activity alerts.',
    activeProvidersCount: 2,
    totalNotificationsSent: 890400,
    createdAt: '2026-02-12T11:30:00Z',
    updatedAt: '2026-08-12T08:00:00Z',
  },
  {
    id: 'app_paypulse_mobile',
    tenantId: 'tnt_fintech',
    name: 'PayPulse iOS & Android App',
    appKey: 'ak_prod_paypulse_mob_3300',
    appSecret: 'sec_live_776655443322110099',
    environment: 'PRODUCTION',
    description: 'Transaction push alerts and instant payment receipts.',
    activeProvidersCount: 2,
    totalNotificationsSent: 3109000,
    createdAt: '2026-03-05T09:15:00Z',
    updatedAt: '2026-08-12T11:20:00Z',
  },
];

export const applicationsApi = {
  getApplications: async (tenantId?: string): Promise<Application[]> => {
    await new Promise((r) => setTimeout(r, 300));
    if (tenantId) {
      return MOCK_APPLICATIONS.filter((a) => a.tenantId === tenantId);
    }
    return MOCK_APPLICATIONS;
  },
  createApplication: async (payload: CreateApplicationPayload): Promise<Application> => {
    const newApp: Application = {
      id: 'app_' + Date.now(),
      tenantId: payload.tenantId,
      name: payload.name,
      appKey: 'ak_' + payload.environment.toLowerCase() + '_' + Math.random().toString(36).substring(2, 8),
      appSecret: 'sec_' + Math.random().toString(36).substring(2, 16),
      environment: payload.environment,
      description: payload.description,
      activeProvidersCount: 0,
      totalNotificationsSent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_APPLICATIONS.push(newApp);
    return newApp;
  },
};
