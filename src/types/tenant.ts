export type TenantStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';

export interface TenantSettings {
  maxApplications: number;
  maxDailyNotifications: number;
  allowedChannels: ('EMAIL' | 'SMS' | 'PUSH' | 'WEBHOOK')[];
  customDomain?: string;
  supportEmail?: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: TenantStatus;
  apiKey: string;
  settings: TenantSettings;
  applicationsCount: number;
  usersCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTenantPayload {
  name: string;
  slug: string;
  status?: TenantStatus;
  settings: TenantSettings;
}

export interface UpdateTenantPayload extends Partial<CreateTenantPayload> {
  id: string;
}
