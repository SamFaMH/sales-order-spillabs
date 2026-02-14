/**
 * Calculate line item amounts based on quantity, price, and tax rate
 * @param {number} quantity - Item quantity
 * @param {number} price - Item price
 * @param {number} taxRate - Tax rate percentage
 * @returns {Object} - { exclAmount, taxAmount, inclAmount }
 */
export const calculateLineAmounts = (quantity, price, taxRate) => {
    const qty = parseFloat(quantity) || 0;
    const prc = parseFloat(price) || 0;
    const tax = parseFloat(taxRate) || 0;

    const exclAmount = qty * prc;
    const taxAmount = (exclAmount * tax) / 100;
    const inclAmount = exclAmount + taxAmount;

    return {
        exclAmount: parseFloat(exclAmount.toFixed(2)),
        taxAmount: parseFloat(taxAmount.toFixed(2)),
        inclAmount: parseFloat(inclAmount.toFixed(2)),
    };
};

/**
 * Calculate order totals from all items
 * @param {Array} items - Array of order items
 * @returns {Object} - { totalExcl, totalTax, totalIncl }
 */
export const calculateOrderTotals = (items) => {
    if (!items || items.length === 0) {
        return { totalExcl: 0, totalTax: 0, totalIncl: 0 };
    }

    const totals = items.reduce(
        (acc, item) => {
            const excl = parseFloat(item.exclAmount) || 0;
            const tax = parseFloat(item.taxAmount) || 0;
            const incl = parseFloat(item.inclAmount) || 0;

            return {
                totalExcl: acc.totalExcl + excl,
                totalTax: acc.totalTax + tax,
                totalIncl: acc.totalIncl + incl,
            };
        },
        { totalExcl: 0, totalTax: 0, totalIncl: 0 }
    );

    return {
        totalExcl: parseFloat(totals.totalExcl.toFixed(2)),
        totalTax: parseFloat(totals.totalTax.toFixed(2)),
        totalIncl: parseFloat(totals.totalIncl.toFixed(2)),
    };
};
