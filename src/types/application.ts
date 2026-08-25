// AppEnvironment values must match the backend AppEnvironment enum exactly
export type AppEnvironment = 'Development' | 'Staging' | 'Production';

// Read-model — maps ApplicationListDto from GET /api/tenants/{id}/applications
export interface Application {
  id: string;               // ApplicationId
  tenantId: string;
  name: string;
  slug: string;
  environment: AppEnvironment;
  status: string;
  clientKeyMasked: string;  // display hint only
  description?: string;
  createdAt: string;
}

// POST /api/tenants/{tenantId}/applications request payload
export interface CreateApplicationPayload {
  tenantId: string;
  name: string;
  environment: AppEnvironment;
  description?: string;
}

// POST /api/tenants/{tenantId}/applications response (CreateApplicationResponseDto)
// clientKey is plain-text and shown ONCE — the user must copy it immediately.
export interface CreateApplicationResponse {
  applicationId: string;
  tenantId: string;
  name: string;
  slug: string;
  environment: string;
  status: string;
  clientKey: string;
  description?: string;
  createdAt: string;
}
