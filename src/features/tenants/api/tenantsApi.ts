<<<<<<< HEAD
import api from '../../../api/axios';
import { Tenant, CreateTenantPayload } from '../../../types/tenant';

// ─── Request body for POST /api/tenants (CreateTenantCommand) ────────────────
interface CreateTenantRequest {
  name: string;
  maxAllowedApplications: number;
  maxDailyNotifications: number;
  supportEmail?: string;
  customDomain?: string;
}

// ─── Response from POST /api/tenants (CreateTenantResponseDto) ───────────────
export interface CreateTenantResponse {
  tenantId: string;
  name: string;
  slug: string;
  status: string;
  apiKey: string;          // plain-text — shown ONCE, store or display immediately
  maxAllowedApplications: number;
  maxDailyNotifications: number;
  supportEmail?: string;
  customDomain?: string;
  createdAt: string;
}

// ─── Response from GET /api/tenants (TenantListDto[]) ────────────────────────
export interface TenantListDto {
  tenantId: string;
  name: string;
  slug: string;
  status: string;
  apiKeyMasked: string;
  applicationCount: number;
  userCount: number;
  maxDailyNotifications: number;
  createdAt: string;
}

// ─── Response from GET /api/tenants/{id} (TenantDto) ─────────────────────────
export interface TenantDto {
  tenantId: string;
  name: string;
  slug: string;
  status: string;
  maxAllowedApplications: number;
  maxDailyNotifications: number;
  applicationCount: number;
  userCount: number;
  supportEmail?: string;
  customDomain?: string;
  createdAt: string;
  updatedAt: string;
}

// Accepted status values for PATCH /api/tenants/{id}/status
export type TenantStatusValue = 'Active' | 'Suspended' | 'Disabled';

// Normalise backend status casing to uppercase frontend enum
const VALID_STATUSES = ['ACTIVE', 'SUSPENDED', 'DISABLED'] as const;
type ValidStatus = typeof VALID_STATUSES[number];

function normalizeStatus(raw: string): Tenant['status'] {
  const upper = raw.toUpperCase() as ValidStatus;
  return VALID_STATUSES.includes(upper) ? upper : 'ACTIVE';
}

export const tenantsApi = {
  // ── GET /api/tenants ─────────────────────────────────────────────────────
  // Returns TenantListDto[] — maps to internal Tenant[] for the list table.
  // Note: maxAllowedApplications is NOT in TenantListDto; use getTenantById for it.
  getTenants: async (): Promise<Tenant[]> => {
    const response = await api.get<TenantListDto[]>('/tenants');
    return response.data.map((dto): Tenant => ({
      id:    dto.tenantId,
      name:  dto.name,
      slug:  dto.slug,
      status: normalizeStatus(dto.status),
      apiKey: dto.apiKeyMasked,
      settings: {
        maxApplications:      0,    // not exposed in list DTO — fetch detail if needed
        maxDailyNotifications: dto.maxDailyNotifications,
        allowedChannels:      [],
      },
      applicationsCount: dto.applicationCount,
      usersCount:        dto.userCount,
      createdAt:         dto.createdAt,
      updatedAt:         dto.createdAt, // list DTO has no updatedAt
    }));
  },

  // ── GET /api/tenants (raw) ────────────────────────────────────────────────
  // Returns the raw TenantListDto[] without mapping — useful for tables that
  // want the exact backend shape (e.g. apiKeyMasked, applicationCount).
  getTenantsRaw: async (): Promise<TenantListDto[]> => {
    const response = await api.get<TenantListDto[]>('/tenants');
    return response.data;
  },

  // ── GET /api/tenants/{id} ─────────────────────────────────────────────────
  // Returns TenantDto — the single endpoint for all roles per the OpenAPI spec.
  getTenantById: async (id: string): Promise<TenantDto> => {
    const response = await api.get<TenantDto>(`/tenants/${id}`);
    return response.data;
  },

  // ── POST /api/tenants ─────────────────────────────────────────────────────
  // Accepts CreateTenantPayload (internal) and maps to CreateTenantCommand body.
  // Returns CreateTenantResponseDto including the plain-text apiKey (one-time).
  createTenant: async (payload: CreateTenantPayload): Promise<CreateTenantResponse> => {
    const request: CreateTenantRequest = {
      name:                   payload.name,
      maxAllowedApplications: payload.settings.maxApplications,
      maxDailyNotifications:  payload.settings.maxDailyNotifications,
      supportEmail:           payload.settings.supportEmail,
      customDomain:           payload.settings.customDomain,
    };
    const response = await api.post<CreateTenantResponse>('/tenants', request);
    return response.data;
  },

  // ── PATCH /api/tenants/{id}/status ───────────────────────────────────────
  changeTenantStatus: async (
    id: string,
    status: TenantStatusValue,
    reason?: string,
  ): Promise<void> => {
    await api.patch(`/tenants/${id}/status`, { status, reason });
=======
import { Tenant, CreateTenantPayload, UpdateTenantPayload } from '../../../types/tenant';

export const MOCK_TENANTS: Tenant[] = [
  {
    // Task 96: temporary — real test-tenant GUID so Create Application hits the live API until tenants API is integrated
    id: '3a504f74-d3b7-4acb-94c2-ae539627bf7e',
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
  createTenant: async (payload: CreateTenantPayload): Promise<Tenant> => {
    const newTenant: Tenant = {
      id: 'tnt_' + Date.now(),
      name: payload.name,
      slug: payload.slug,
      status: payload.status || 'ACTIVE',
      apiKey: 'ntf_live_' + payload.slug + '_' + Math.random().toString(36).substring(2, 10),
      settings: payload.settings,
      applicationsCount: 0,
      usersCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_TENANTS.push(newTenant);
    return newTenant;
  },
  updateTenant: async (payload: UpdateTenantPayload): Promise<Tenant> => {
    const index = MOCK_TENANTS.findIndex((t) => t.id === payload.id);
    if (index === -1) throw new Error('Tenant not found');
    MOCK_TENANTS[index] = { ...MOCK_TENANTS[index], ...payload, updatedAt: new Date().toISOString() };
    return MOCK_TENANTS[index];
>>>>>>> develop
  },
};
