import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customerService } from '../../services/customerService';

// Async thunks
export const fetchCustomers = createAsyncThunk(
    'customers/fetchAll',
    async () => {
        const data = await customerService.getAllCustomers();
        return data;
    }
);

const customerSlice = createSlice({
    name: 'customers',
    initialState: {
        list: [],
        selectedCustomer: null,
        loading: false,
        error: null,
    },
    reducers: {
        setSelectedCustomer: (state, action) => {
            state.selectedCustomer = action.payload;
        },
        clearSelectedCustomer: (state) => {
            state.selectedCustomer = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setSelectedCustomer, clearSelectedCustomer } = customerSlice.actions;
export default customerSlice.reducer;
