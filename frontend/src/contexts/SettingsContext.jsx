import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import settingsService from '../services/settingsService';

const SettingsContext = createContext();

const CACHE_KEY = 'app_currency_rates';
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        currency: 'GHS',
        lowStockThreshold: 10,
        expiryAlertDays: 30,
        emailNotifications: true,
        dashboardRefresh: 5,
    });
    const [loading, setLoading] = useState(true);
    const [rates, setRates] = useState({});

    const saveRatesToCache = (newRates) => {
        const cacheData = {
            timestamp: Date.now(),
            rates: newRates
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    };

    const loadRatesFromCache = () => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (!cached) return null;
            
            const { timestamp, rates: cachedRates } = JSON.parse(cached);
            const age = Date.now() - timestamp;
            
            if (age < CACHE_DURATION) {
                return cachedRates;
            }
        } catch (e) {
            console.error('Failed to load rates from cache', e);
        }
        return null;
    };

    const handleCurrencyUpdate = useCallback((event) => {
        const { currency, rates: newRates } = event.detail;
        
        if (currency) {
            setSettings(prev => ({ ...prev, currency }));
        }
        
        if (newRates) {
            setRates(prev => {
                // Perform deep equality check to prevent redundant updates
                const isIdentical = JSON.stringify(prev) === JSON.stringify({ ...prev, ...newRates });
                if (isIdentical) return prev;

                const updated = { ...prev, ...newRates };
                saveRatesToCache(updated);
                return updated;
            });
        }
    }, []);

    useEffect(() => {
        window.addEventListener('app:currency-update', handleCurrencyUpdate);
        return () => window.removeEventListener('app:currency-update', handleCurrencyUpdate);
    }, [handleCurrencyUpdate]);

    const fetchSettingsData = useCallback(async () => {
        try {
            setLoading(true);
            
            // 1. Try to load cached rates first for immediate display
            const cachedRates = loadRatesFromCache();
            if (cachedRates) {
                setRates(cachedRates);
            }

            // 2. Fetch Notification & Alert Settings
            const notifResponse = await settingsService.getNotificationSettings();
            const notifData = notifResponse?.data || notifResponse || {};
            
            // 3. Fetch Currency & Rate Settings
            const currencyResponse = await settingsService.getCurrencySettings();
            const currencyPayload = currencyResponse?.data || currencyResponse || {};
            const currencyData = currencyPayload?.data || currencyPayload;
            
            setSettings(prev => ({
                ...prev,
                currency: currencyData.currency || currencyData.currentCurrency || notifData.currency || 'GHS',
                lowStockThreshold: notifData.lowStockThreshold || 10,
                expiryAlertDays: notifData.expiryAlertDays || 30,
                emailNotifications: notifData.emailNotifications !== false,
                dashboardRefresh: notifData.dashboardRefresh || 5,
            }));

            if (currencyData.rates) {
                setRates(prev => {
                    const updated = { ...prev, ...currencyData.rates };
                    saveRatesToCache(updated);
                    return updated;
                });
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettingsData();
    }, [fetchSettingsData]);

    const updateSettings = async (newSettings) => {
        const previousSettings = { ...settings };
        setSettings(prev => ({ ...prev, ...newSettings }));

        try {
            const { currency, ...otherSettings } = newSettings;

            if (currency) {
                await settingsService.updateCurrencySettings({ currency });
            }
            
            if (Object.keys(otherSettings).length > 0) {
                await settingsService.updateNotificationSettings(otherSettings);
            }
            
            return true;
        } catch (error) {
            console.error('Failed to update settings:', error);
            setSettings(previousSettings);
            throw error;
        }
    };

    const value = React.useMemo(() => ({
        settings,
        currency: settings.currency,
        rates,
        updateSettings,
        refreshSettings: fetchSettingsData,
        loading
    }), [settings, rates, updateSettings, fetchSettingsData, loading]);

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
