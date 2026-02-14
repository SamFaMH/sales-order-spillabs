import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { itemService } from '../../services/itemService';

// Async thunks
export const fetchItems = createAsyncThunk(
    'items/fetchAll',
    async () => {
        const data = await itemService.getAllItems();
        return data;
    }
);

const itemSlice = createSlice({
    name: 'items',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default itemSlice.reducer;
