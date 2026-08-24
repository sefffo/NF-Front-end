import { AuthState, AuthUser } from '../types/auth';
import { Tenant } from '../types/tenant';

export interface AppStoreState {
  auth: AuthState;
  activeTenant: Tenant | null;
  tenants: Tenant[];
}

export const initialStoreState: AppStoreState = {
  auth: {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  },
  activeTenant: null,
  tenants: [],
};
