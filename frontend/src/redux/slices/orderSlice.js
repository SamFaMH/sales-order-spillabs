import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '../../services/orderService';

// Async thunks
export const fetchOrders = createAsyncThunk(
    'orders/fetchAll',
    async () => {
        const data = await orderService.getAllOrders();
        return data;
    }
);

export const fetchOrderById = createAsyncThunk(
    'orders/fetchById',
    async (id) => {
        const data = await orderService.getOrderById(id);
        return data;
    }
);

export const createOrder = createAsyncThunk(
    'orders/create',
    async (orderData) => {
        const data = await orderService.createOrder(orderData);
        return data;
    }
);

export const updateOrder = createAsyncThunk(
    'orders/update',
    async ({ id, orderData }) => {
        const data = await orderService.updateOrder(id, orderData);
        return data;
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        list: [],
        currentOrder: null,
        loading: false,
        error: null,
        saveSuccess: false,
    },
    reducers: {
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
            state.saveSuccess = false;
        },
        clearSaveSuccess: (state) => {
            state.saveSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all orders
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Fetch order by ID
            .addCase(fetchOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Create order
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.saveSuccess = false;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
                state.saveSuccess = true;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.saveSuccess = false;
            })
            // Update order
            .addCase(updateOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.saveSuccess = false;
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
                state.saveSuccess = true;
            })
            .addCase(updateOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.saveSuccess = false;
            });
    },
});

export const { clearCurrentOrder, clearSaveSuccess } = orderSlice.actions;
export default orderSlice.reducer;
