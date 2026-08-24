export type AppEnvironment = 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION';

export interface Application {
  id: string;
  tenantId: string;
  name: string;
  appKey: string;
  appSecret: string;
  environment: AppEnvironment;
  description?: string;
  activeProvidersCount: number;
  totalNotificationsSent: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationPayload {
  tenantId: string;
  name: string;
  environment: AppEnvironment;
  description?: string;
}
