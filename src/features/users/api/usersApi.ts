import { UserEntity, CreateUserPayload } from '../../../types/user';

export const MOCK_USERS: UserEntity[] = [
  {
    id: 'usr_1',
    email: 'admin@notifications.io',
    firstName: 'Alexander',
    lastName: 'Vance',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    lastLoginAt: '2026-08-12T23:10:00Z',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr_2',
    tenantId: 'tnt_acme',
    tenantName: 'Acme Global Inc.',
    email: 'sarah.connor@acme.com',
    firstName: 'Sarah',
    lastName: 'Connor',
    role: 'TENANT_ADMIN',
    status: 'ACTIVE',
    lastLoginAt: '2026-08-12T19:40:00Z',
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'usr_3',
    tenantId: 'tnt_fintech',
    tenantName: 'PayPulse Financial',
    email: 'david.miller@paypulse.io',
    firstName: 'David',
    lastName: 'Miller',
    role: 'TENANT_ADMIN',
    status: 'ACTIVE',
    lastLoginAt: '2026-08-11T14:12:00Z',
    createdAt: '2026-03-01T11:00:00Z',
  },
  {
    id: 'usr_4',
    tenantId: 'tnt_acme',
    tenantName: 'Acme Global Inc.',
    email: 'dev.team@acme.com',
    firstName: 'Developer',
    lastName: 'User',
    role: 'USER',
    status: 'ACTIVE',
    lastLoginAt: '2026-08-10T08:30:00Z',
    createdAt: '2026-04-05T10:00:00Z',
  },
];

export const usersApi = {
  getUsers: async (tenantId?: string): Promise<UserEntity[]> => {
    await new Promise((r) => setTimeout(r, 250));
    if (tenantId) {
      return MOCK_USERS.filter((u) => u.tenantId === tenantId);
    }
    return MOCK_USERS;
  },
  createUser: async (payload: CreateUserPayload): Promise<UserEntity> => {
    const newUser: UserEntity = {
      id: 'usr_' + Date.now(),
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role,
      tenantId: payload.tenantId,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
    MOCK_USERS.push(newUser);
    return newUser;
  },
};
