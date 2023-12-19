import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchBaseUrl } from './configSlice';

const useBaseUrlFetcher = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchBaseUrl());
    }, [dispatch]);
};

export default useBaseUrlFetcher;
