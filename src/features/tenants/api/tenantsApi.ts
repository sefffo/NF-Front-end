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
// GlobalAdmin only
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

// ─── Shape returned by GET /api/tenants/{id} for GlobalAdmin (TenantDto) ─────
// Includes all internal fields: TenantId, Slug, UpdatedAt, limits, counts
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

// ─── Shape returned by GET /api/tenants/{id} for TenantAdmin (TenantProfileDto)
// Safe public-facing view — no DB IDs, no Slug, no UpdatedAt
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

// ─── Mock data kept so existing imports don't break ──────────────────────────
export const MOCK_TENANTS: Tenant[] = [];

export const tenantsApi = {
  // GET /api/tenants — GlobalAdmin only
  getTenants: async (): Promise<Tenant[]> => {
    const response = await api.get<TenantListDto[]>('/tenants');
    return response.data.map((dto): Tenant => ({
      id: dto.tenantId,
      name: dto.name,
      slug: dto.slug,
      status: dto.status.toUpperCase() as Tenant['status'],
      apiKey: dto.apiKeyMasked,
      settings: {
        maxApplications: 0,            // not returned by list endpoint
        maxDailyNotifications: dto.maxDailyNotifications,
        allowedChannels: [],
      },
      applicationsCount: dto.applicationCount,
      usersCount: dto.userCount,
      createdAt: dto.createdAt,
      updatedAt: dto.createdAt,
    }));
  },

  // GET /api/tenants/{id} — GlobalAdmin only
  // Returns full TenantDto with all internal fields (TenantId, Slug, UpdatedAt)
  getTenantById: async (id: string): Promise<TenantDto> => {
    const response = await api.get<TenantDto>(`/tenants/${id}`);
    return response.data;
  },

  // GET /api/tenants/{id} — TenantAdmin only
  // Returns TenantProfileDto — no DB IDs, no Slug, no UpdatedAt
  // The id comes from the JWT claims stored in auth state, not user input
  getTenantProfile: async (id: string): Promise<TenantProfileDto> => {
    const response = await api.get<TenantProfileDto>(`/tenants/${id}`);
    return response.data;
  },

  // POST /api/tenants — GlobalAdmin only
  createTenant: async (payload: CreateTenantPayload): Promise<CreateTenantResponse> => {
    const request: CreateTenantRequest = {
      name: payload.name,
      maxAllowedApplications: payload.settings.maxApplications,
      maxDailyNotifications: payload.settings.maxDailyNotifications,
      supportEmail: payload.settings.supportEmail,
      customDomain: payload.settings.customDomain,
    };
    const response = await api.post<CreateTenantResponse>('/tenants', request);
    return response.data;
  },
};
