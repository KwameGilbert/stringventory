/**
 * Role Management API Service
 */

import { apiClient, API_ENDPOINTS } from './api.client';

export const roleService = {
  getRoles: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.ROLES.LIST, { params });
  },
};

export default roleService;
