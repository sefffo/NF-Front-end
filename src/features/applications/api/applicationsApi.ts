import api from '../../../api/axios';
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
    return res.data;  },
};

