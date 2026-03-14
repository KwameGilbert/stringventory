/**
 * Role Management API Service
 */

import { apiClient, API_ENDPOINTS } from './api.client';

/**
 * Display-only fallback roles (no IDs) for when the API is unreachable.
 * Only the `name` is used; `roleId` will not be sent to the backend.
 */
export const BUSINESS_ROLES = [
  { name: 'CEO', description: 'Full access to all dashboard modules and actions', _fallback: true },
  { name: 'Manager', description: 'Full access except adding users', _fallback: true },
  { name: 'Sales', description: 'Dashboard + view products/categories/customers + create sale', _fallback: true },
];

export const roleService = {
  getRoles: async (params = {}) => {
    try {
      return await apiClient.get(API_ENDPOINTS.ROLES.LIST, { params });
    } catch {
      // Fallback to the 3 defined business roles when endpoint is unavailable
      return { data: BUSINESS_ROLES };
    }
  },
};

export default roleService;
