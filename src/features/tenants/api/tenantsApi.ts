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
    await api.patch(`/tenants/${id}/status`, { status, reason });  },
};

