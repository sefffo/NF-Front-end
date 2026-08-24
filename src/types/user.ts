import { UserRole } from './auth';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'INVITED';

export interface UserEntity {
  id: string;
  tenantId?: string;
  tenantName?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: string;
  createdAt: string;
}

export interface CreateUserPayload {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId?: string;
}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {
  id: string;
  status?: UserStatus;
}
