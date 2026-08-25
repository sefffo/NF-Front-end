import api from '../../../api/axios';
import { Tenant, CreateTenantPayload } from '../../../types/tenant';

// ─── Flat payload the backend CreateTenantCommand actually expects ────────────
interface CreateTenantRequest {
  name: string;
  maxAllowedApplications: number;
  maxDailyNotifications: number;
  supportEmail?: string;
  customDomain?: string;
}

// ─── Typed response from POST /api/tenants (CreateTenantResponseDto) ─────────
export interface CreateTenantResponse {
  tenantId: string;
  name: string;
  slug: string;
  status: string;
  apiKey: string;          // plain-text — shown ONCE, store it immediately
  maxAllowedApplications: number;
  maxDailyNotifications: number;
  supportEmail?: string;
  customDomain?: string;
  createdAt: string;
}

// ─── Shape returned by GET /api/tenants (TenantListDto) ──────────────────────
interface TenantListDto {
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

// ─── Shape returned by GET /api/tenants/{id} for GlobalAdmin ─────────────────
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

// ─── Shape returned by GET /api/tenants/{id} for TenantAdmin ─────────────────
export interface TenantProfileDto {
  name: string;
  status: string;
  maxAllowedApplications: number;
  maxDailyNotifications: number;
  applicationCount: number;
  userCount: number;
  supportEmail?: string;
  customDomain?: string;
  createdAt: string;
}

// Accepted status values for PATCH /api/tenants/{id}/status
export type TenantStatusValue = 'Active' | 'Suspended' | 'Disabled';

// Normalize any casing the backend might return to the frontend Tenant['status'] enum
const VALID_STATUSES: Tenant['status'][] = ['ACTIVE', 'SUSPENDED', 'DISABLED'];
function normalizeStatus(raw: string): Tenant['status'] {
  const upper = raw.toUpperCase() as Tenant['status'];
  return VALID_STATUSES.includes(upper) ? upper : 'ACTIVE';
}

export const MOCK_TENANTS: Tenant[] = [];

export const tenantsApi = {
  // GET /api/tenants — GlobalAdmin only
  getTenants: async (): Promise<Tenant[]> => {
    const response = await api.get<TenantListDto[]>('/tenants');
    return response.data.map((dto): Tenant => ({
      id:    dto.tenantId,
      name:  dto.name,
      slug:  dto.slug,
      status: normalizeStatus(dto.status), // fix: safe normalization handles any casing
      apiKey: dto.apiKeyMasked,
      settings: {
        maxApplications: 0,               // not in list DTO — fetch detail if needed
        maxDailyNotifications: dto.maxDailyNotifications,
        allowedChannels: [],
      },
      applicationsCount: dto.applicationCount,
      usersCount:        dto.userCount,
      createdAt:         dto.createdAt,
      updatedAt:         dto.createdAt,   // list DTO has no updatedAt — use createdAt as fallback
    }));
  },

  // GET /api/tenants/{id} — GlobalAdmin: returns TenantDto with all internal fields
  getTenantById: async (id: string): Promise<TenantDto> => {
    const response = await api.get<TenantDto>(`/tenants/${id}`);
    return response.data;
  },

  // GET /api/tenants/{id} — TenantAdmin: returns TenantProfileDto (safe public view)
  getTenantProfile: async (id: string): Promise<TenantProfileDto> => {
    const response = await api.get<TenantProfileDto>(`/tenants/${id}`);
    return response.data;
  },

  // POST /api/tenants — GlobalAdmin only
  createTenant: async (payload: CreateTenantPayload): Promise<CreateTenantResponse> => {
    const request: CreateTenantRequest = {
      name:                  payload.name,
      maxAllowedApplications: payload.settings.maxApplications,
      maxDailyNotifications:  payload.settings.maxDailyNotifications,
      supportEmail:           payload.settings.supportEmail,
      customDomain:           payload.settings.customDomain,
    };
    const response = await api.post<CreateTenantResponse>('/tenants', request);
    return response.data;
  },

  // PATCH /api/tenants/{id}/status — GlobalAdmin only
  // fix: was missing — needed by TenantDetailsPage and any status management UI
  changeTenantStatus: async (
    id: string,
    status: TenantStatusValue,
    reason?: string
  ): Promise<void> => {
    await api.patch(`/tenants/${id}/status`, { status, reason });
  },
};
