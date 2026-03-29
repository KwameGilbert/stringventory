import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import settingsService from '../services/settingsService';

const SettingsContext = createContext();

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

    const [rates, setRates] = useState({
        GHS: 1.0,
        USD: 16.0,
        EUR: 17.5,
        GBP: 20.2,
    });

    const fetchRates = useCallback(async () => {
        try {
            const response = await fetch('https://open.er-api.com/v6/latest/GHS');
            const data = await response.json();
            if (data && data.rates) {
                // We want the inverse rates because our logic expects: 1 USD = X GHS
                // API returns: 1 GHS = Y USD
                // So X = 1/Y
                setRates({
                    GHS: 1.0,
                    USD: 1 / (data.rates.USD || (1 / 16.0)),
                    EUR: 1 / (data.rates.EUR || (1 / 17.5)),
                    GBP: 1 / (data.rates.GBP || (1 / 20.2)),
                });
            }
        } catch (error) {
            console.error('Failed to fetch exchange rates:', error);
        }
    }, []);

    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            const response = await settingsService.getNotificationSettings();
            const data = response?.data || response || {};
            setSettings({
                currency: data.currency || 'GHS',
                lowStockThreshold: data.lowStockThreshold || 10,
                expiryAlertDays: data.expiryAlertDays || 30,
                emailNotifications: data.emailNotifications !== false,
                dashboardRefresh: data.dashboardRefresh || 5,
            });
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
        fetchRates();
    }, [fetchSettings, fetchRates]);

    const updateSettings = async (newSettings) => {
        try {
            await settingsService.updateNotificationSettings(newSettings);
            setSettings(prev => ({ ...prev, ...newSettings }));
            return true;
        } catch (error) {
            console.error('Failed to update settings:', error);
            throw error;
        }
    };

    const value = {
        settings,
        currency: settings.currency,
        rates,
        updateSettings,
        refreshSettings: fetchSettings,
        loading
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
