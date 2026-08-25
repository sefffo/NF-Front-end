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

// ─── Shape returned by GET /api/tenants/{id} (TenantDto) ─────────────────────
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

// ─── Mock data kept so existing imports don't break ──────────────────────────
export const MOCK_TENANTS: Tenant[] = [];

export const tenantsApi = {
  // GET /api/tenants — real API
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

  // GET /api/tenants/{id} — real API — maps full TenantDto (all 12 fields)
  getTenantById: async (id: string): Promise<TenantDto> => {
    const response = await api.get<TenantDto>(`/tenants/${id}`);
    return response.data;
  },

  // POST /api/tenants — real API (flat payload matching CreateTenantCommand)
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
