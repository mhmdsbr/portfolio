import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchBaseUrl = createAsyncThunk('config/fetchBaseUrl', async () => {
    const mainConfURL = 'https://mohammadsaber.com/server/wp-json/portfolio/v2/config-portfolio';
    const res = await axios.get(`${mainConfURL}`);
    return res.data.api_base_url;
});

const configSlice = createSlice({
    name: 'config',
    initialState: {
        baseUrl: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBaseUrl.fulfilled, (state, action) => {
                state.baseUrl = action.payload;
            });
    },
});

export default configSlice.reducer;
