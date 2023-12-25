import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchDataAsync = createAsyncThunk('data/fetchData', async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
});

const dataSlice = createSlice({
    name: 'data',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        // You can add any specific synchronous reducers if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDataAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDataAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchDataAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { actions: dataActions, reducer: dataReducer } = dataSlice;

export default dataSlice;
