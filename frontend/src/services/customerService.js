import api from './api';

export const customerService = {
    getAllCustomers: async () => {
        const response = await api.get('/api/customers');
        return response.data;
    },

    createCustomer: async (customerData) => {
        const response = await api.post('/api/customers', customerData);
        return response.data;
    },
};
