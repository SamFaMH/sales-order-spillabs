import api from './api';

export const orderService = {
    getAllOrders: async () => {
        const response = await api.get('/api/orders');
        return response.data;
    },

    getOrderById: async (id) => {
        const response = await api.get(`/api/orders/${id}`);
        return response.data;
    },

    createOrder: async (orderData) => {
        const response = await api.post('/api/orders', orderData);
        return response.data;
    },

    updateOrder: async (id, orderData) => {
        const response = await api.put(`/api/orders/${id}`, orderData);
        return response.data;
    },
};
