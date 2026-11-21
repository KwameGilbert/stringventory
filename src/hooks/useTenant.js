import {useContext} from 'react';
import { TenantContext } from '../providers/TenantContext';

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
};
