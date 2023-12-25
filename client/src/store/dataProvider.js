import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchDataAsync } from './dataSlice'

const DataProvider = ({ url }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchDataAsync(url));
    }, [dispatch, url]);

    return null;
};

export default DataProvider;
