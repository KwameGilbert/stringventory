/**
 * Currency Symbols Mapping
 */
export const CURRENCY_SYMBOLS = {
  GHS: "₵",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

/**
 * Convert an amount from source to target currency
 * @param {number|string} amount - The value to convert
 * @param {string} targetCurrency - Destination currency code (e.g. "USD")
 * @param {object} rates - Current nested exchange rates mapping { SOURCE: { TARGET: { rate: 0.1 } } }
 * @param {string} sourceCurrency - The currency of the original amount (default "GHS")
 * @returns {number} Converted amount or 0 if input is invalid
 */
export const convertAmount = (amount, targetCurrency = "GHS", rates = {}, sourceCurrency = "GHS") => {
  const numericAmount = Number(amount);
  
  // Guard against non-numeric inputs or matching currencies
  if (isNaN(numericAmount) || !isFinite(numericAmount)) return 0;
  if (targetCurrency === sourceCurrency) return numericAmount;
  
  // Traverse rates object: rates[source][target].rate
  // Fallback to 1 if the path is missing (no conversion)
  const rateData = rates?.[sourceCurrency]?.[targetCurrency];
  const rate = typeof rateData === 'object' ? rateData?.rate : (typeof rateData === 'number' ? rateData : 1);
  
  return numericAmount * rate;
};

// Cache for Intl.NumberFormat instances to avoid expensive recreation
const formatterCache = new Map();

const getFormatter = (currency, options = {}) => {
  const key = `${currency}-${JSON.stringify(options)}`;
  if (!formatterCache.has(key)) {
    formatterCache.set(key, new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options
    }));
  }
  return formatterCache.get(key);
};

/**
 * Format a number as a currency string with automatic conversion
 * @param {number|string} amount - Amount in source currency
 * @param {string} targetCurrency - Selected display currency
 * @param {object} rates - Current exchange rates
 * @param {string} sourceCurrency - The currency the 'amount' is currently in (default "GHS")
 * @returns {string} Formatted string (e.g., "$10.00")
 */
export const formatCurrency = (amount, targetCurrency = "GHS", rates = {}, sourceCurrency = "GHS") => {
  const target = targetCurrency?.toUpperCase() || "GHS";
  const converted = convertAmount(amount, target, rates, sourceCurrency);
  
  try {
    // Try using high-performance Intl formatter
    return getFormatter(target).format(converted);
  } catch (e) {
    // Fallback for untrusted currency codes or environments
    const symbol = CURRENCY_SYMBOLS[target] || target || "₵";
    return `${symbol}${Number(converted).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
};

import { useSettings } from "../contexts/SettingsContext";

import { useMemo, useCallback } from "react";

/**
 * Hook-ready formatter that uses the SettingsContext
 * Usage: const { formatPrice, convert } = useCurrency();
 */
export const useCurrency = () => {
  const { settings, rates } = useSettings();
  const targetCurrency = settings?.currency || "GHS";
  
  const formatPrice = useCallback((amount, sourceCurrency = "GHS") => 
    formatCurrency(amount, targetCurrency, rates, sourceCurrency), 
  [targetCurrency, rates]);

  const convert = useCallback((amount, sourceCurrency = "GHS") => 
    convertAmount(amount, targetCurrency, rates, sourceCurrency), 
  [targetCurrency, rates]);

  return useMemo(() => ({
    formatPrice,
    convert,
    symbol: CURRENCY_SYMBOLS[targetCurrency?.toUpperCase()] || "₵",
    currencyCode: targetCurrency?.toUpperCase(),
    rates: rates || {}
  }), [formatPrice, convert, targetCurrency, rates]);
};
