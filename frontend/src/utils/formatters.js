import { format } from 'date-fns';

/**
 * Format a number as currency
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

/**
 * Format a date for display
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
    if (!date) return '';
    try {
        return format(new Date(date), 'yyyy-MM-dd');
    } catch (error) {
        return '';
    }
};

/**
 * Format a date for display with time
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDateTime = (date) => {
    if (!date) return '';
    try {
        return format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
    } catch (error) {
        return '';
    }
};
