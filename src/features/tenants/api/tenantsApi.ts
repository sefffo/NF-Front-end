import api from '../../../api/axios';
import { Tenant, CreateTenantPayload, UpdateTenantPayload } from '../../../types/tenant';

// ─── Mock data (used by GET endpoints until those are integrated) ─────────────
export const MOCK_TENANTS: Tenant[] = [
  {
    id: 'tnt_acme',
    name: 'Acme Global Inc.',
    slug: 'acme-global',
    status: 'ACTIVE',
    apiKey: 'ntf_live_acme_987412356401',
    settings: {
      maxApplications: 10,
      maxDailyNotifications: 100000,
      allowedChannels: ['EMAIL', 'SMS', 'PUSH', 'WEBHOOK'],
      customDomain: 'notifications.acme.com',
      supportEmail: 'support@acme.com',
    },
    applicationsCount: 4,
    usersCount: 18,
    createdAt: '2026-01-15T08:30:00Z',
    updatedAt: '2026-08-10T14:20:00Z',
  },
  {
    id: 'tnt_fintech',
    name: 'PayPulse Financial',
    slug: 'paypulse-fintech',
    status: 'ACTIVE',
    apiKey: 'ntf_live_paypulse_1122334455',
    settings: {
      maxApplications: 5,
      maxDailyNotifications: 500000,
      allowedChannels: ['SMS', 'PUSH', 'WEBHOOK'],
      supportEmail: 'devs@paypulse.io',
    },
    applicationsCount: 2,
    usersCount: 8,
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-08-12T09:15:00Z',
  },
  {
    id: 'tnt_health',
    name: 'Aura Health Solutions',
    slug: 'aura-health',
    status: 'PENDING',
    apiKey: 'ntf_test_aura_9988776655',
    settings: {
      maxApplications: 2,
      maxDailyNotifications: 10000,
      allowedChannels: ['EMAIL', 'PUSH'],
    },
    applicationsCount: 1,
    usersCount: 3,
    createdAt: '2026-08-01T12:00:00Z',
    updatedAt: '2026-08-01T12:00:00Z',
  },
];

export const tenantsApi = {
  getTenants: async (): Promise<Tenant[]> => {
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_TENANTS;
  },

  getTenantById: async (id: string): Promise<Tenant | undefined> => {
    return MOCK_TENANTS.find((t) => t.id === id);
  },

  // ── Real integration ──────────────────────────────────────────────────────
  createTenant: async (payload: CreateTenantPayload): Promise<Tenant> => {
    const response = await api.post<Tenant>('/tenants', payload);
    return response.data;
  },

  updateTenant: async (payload: UpdateTenantPayload): Promise<Tenant> => {
    const index = MOCK_TENANTS.findIndex((t) => t.id === payload.id);
    if (index === -1) throw new Error('Tenant not found');
    MOCK_TENANTS[index] = { ...MOCK_TENANTS[index], ...payload, updatedAt: new Date().toISOString() };
    return MOCK_TENANTS[index];
  },
};
