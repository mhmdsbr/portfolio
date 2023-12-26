import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchDataAsync } from './dataSlice';

const baseUrl = 'https://mohammadsaber.com/server/wp-json/portfolio/v2';

const DataProvider = ({ endpoint }) => {
    const dispatch = useDispatch();
    const url = `${baseUrl}/${endpoint}`;

    useEffect(() => {
        dispatch(fetchDataAsync(url));
    }, [dispatch, url]);

    return null;
};

export default DataProvider;
