import { useState, useEffect } from 'react';
import { TenantContext } from './TenantContext';

export const TenantProvider = ({ children }) => {
  const [currentBusiness, setCurrentBusiness] = useState(() => {
    const stored = localStorage.getItem('current_business');
    return stored ? JSON.parse(stored) : null;
  });

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentBusiness) {
      localStorage.setItem('current_business', JSON.stringify(currentBusiness));
    } else {
      localStorage.removeItem('current_business');
    }
  }, [currentBusiness]);

  const switchBusiness = (business) => {
    setCurrentBusiness(business);
  };

  const updateBusinessUsage = (usageData) => {
    if (currentBusiness) {
      setCurrentBusiness({
        ...currentBusiness,
        current_usage: {
          ...currentBusiness.current_usage,
          ...usageData
        }
      });
    }
  };

  const value = {
    currentBusiness,
    businesses,
    setBusinesses,
    switchBusiness,
    updateBusinessUsage,
    loading,
    setLoading
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};
