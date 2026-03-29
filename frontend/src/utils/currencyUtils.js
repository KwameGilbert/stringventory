/**
 * Exchange rates relative to GHS (Base Currency)
 * These can be updated from an API in a production environment
 */
export const EXCHANGE_RATES = {
  GHS: 1.0,
  USD: 16.0,   // 1 USD = 16 GHS
  EUR: 17.5,   // 1 EUR = 17.5 GHS
  GBP: 20.2,   // 1 GBP = 20.2 GHS
};

export const CURRENCY_SYMBOLS = {
  GHS: "₵",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

/**
 * Convert an amount from GHS to target currency
 * @param {number} amount - Amount in GHS
 * @param {string} targetCurrency - Destination currency code
 * @returns {number} Converted amount
 */
export const convertAmount = (amount, targetCurrency = "GHS", rates = EXCHANGE_RATES) => {
  const rate = rates[targetCurrency] || EXCHANGE_RATES[targetCurrency] || 1;
  if (targetCurrency === "GHS") return amount;
  return amount / rate;
};

/**
 * Format a number as a currency string
 * @param {number} amount - Amount in GHS (will be converted)
 * @param {string} targetCurrency - Selected currency
 * @param {object} rates - Current exchange rates
 * @returns {string} Formatted string (e.g., "$10.00")
 */
export const formatCurrency = (amount, targetCurrency = "GHS", rates = EXCHANGE_RATES) => {
  const converted = convertAmount(amount, targetCurrency, rates);
  const symbol = CURRENCY_SYMBOLS[targetCurrency] || "₵";
  
  return `${symbol}${Number(converted).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

import { useSettings } from "../contexts/SettingsContext";

/**
 * Hook-ready formatter that uses the SettingsContext
 * Usage: const { formatPrice } = useCurrency();
 */
export const useCurrency = () => {
  const { settings, rates } = useSettings();
  const targetCurrency = settings?.currency || "GHS";
  
  return {
    formatPrice: (amount) => formatCurrency(amount, targetCurrency, rates),
    convert: (amount) => convertAmount(amount, targetCurrency, rates),
    symbol: CURRENCY_SYMBOLS[targetCurrency],
    currencyCode: targetCurrency,
    rates: rates || EXCHANGE_RATES
  };
};
