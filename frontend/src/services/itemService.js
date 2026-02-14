import api from './api';

export const itemService = {
    getAllItems: async () => {
        const response = await api.get('/api/items');
        return response.data;
    },

    getItemById: async (id) => {
        const response = await api.get(`/api/items/${id}`);
        return response.data;
    },

    createItem: async (itemData) => {
        const response = await api.post('/api/items', itemData);
        return response.data;
    },
};
