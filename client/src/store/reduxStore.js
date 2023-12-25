import { configureStore } from '@reduxjs/toolkit';
import configReducer from './configSlice';
import {dataReducer} from './dataSlice';

const store = configureStore({
    reducer: {
        config: configReducer,
        data: dataReducer,
    },
});

export default store;
