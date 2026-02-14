import { configureStore } from '@reduxjs/toolkit';
import customerReducer from './slices/customerSlice';
import itemReducer from './slices/itemSlice';
import orderReducer from './slices/orderSlice';

export const store = configureStore({
    reducer: {
        customers: customerReducer,
        items: itemReducer,
        orders: orderReducer,
    },
});

export default store;
