import api from '../../../api/axios';
<<<<<<< HEAD
import { Application, CreateApplicationPayload, CreateApplicationResponse } from '../../../types/application';

// Shape returned by GET /api/tenants/{id}/applications (ApplicationListDto)
interface ApplicationListDto {
  applicationId: string;
  tenantId: string;
  name: string;
  slug: string;
  environment: string;
  status: string;
  clientKeyMasked: string;
  description?: string;
  createdAt: string;
}

// Shape returned by GET /api/applications/{id} (ApplicationDto)
export interface ApplicationDto {
  applicationId: string;
  tenantId: string;
  name: string;
  slug: string;
  environment: string;
  status: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data kept so any existing import compiles — no longer used at runtime
export const MOCK_APPLICATIONS: Application[] = [];

function mapListDto(dto: ApplicationListDto): Application {
  return {
    id: dto.applicationId,
    tenantId: dto.tenantId,
    name: dto.name,
    slug: dto.slug,
    environment: dto.environment as Application['environment'],
    status: dto.status,
    clientKeyMasked: dto.clientKeyMasked,
    description: dto.description,
    createdAt: dto.createdAt,
  };
}

export const applicationsApi = {
  // GET /api/tenants/{tenantId}/applications — real API
  getApplications: async (tenantId: string): Promise<Application[]> => {
    const res = await api.get<ApplicationListDto[]>(`/tenants/${tenantId}/applications`);
    return res.data.map(mapListDto);
  },

  // GET /api/applications/{id} — real API — returns full ApplicationDto
  getApplicationById: async (id: string): Promise<ApplicationDto> => {
    const res = await api.get<ApplicationDto>(`/applications/${id}`);
    return res.data;
  },

  // POST /api/tenants/{tenantId}/applications — real API
  // Returns CreateApplicationResponse with plain-text clientKey (shown once)
  createApplication: async (payload: CreateApplicationPayload): Promise<CreateApplicationResponse> => {
    const res = await api.post<CreateApplicationResponse>(
      `/tenants/${payload.tenantId}/applications`,
      {
        name: payload.name,
        environment: payload.environment,
        description: payload.description,
      }
    );
    return res.data;
=======
import {
  Application,
  CreateApplicationPayload,
  CreateApplicationResponse,
} from '../../../types/application';

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app_marketing_hub',
    tenantId: '3a504f74-d3b7-4acb-94c2-ae539627bf7e',
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
    tenantId: '3a504f74-d3b7-4acb-94c2-ae539627bf7e',
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
  // real API call replacing the mock implementation — tenantId goes in the route
  createApplication: async (
    tenantId: string,
    payload: CreateApplicationPayload
  ): Promise<CreateApplicationResponse> => {
    const { data } = await api.post<CreateApplicationResponse>(
      `/tenants/${tenantId}/applications`,
      payload
    );
    return data;
>>>>>>> develop
  },
};
