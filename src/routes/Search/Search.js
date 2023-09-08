import { useEffect } from 'react';
import { Stack } from '@mui/material';
import SearchForm from '../../components/search/SearchForm';
import SearchResults from '../../components/search/SearchResults';
import './Search.scss';

const Search = () => {
    // Scroll to top of the page on mount
    useEffect(() => window.scrollTo(0, 0), []);

    return (
        <Stack className='Search' component='main' direction='row' spacing={4}>
            <SearchForm />
            <SearchResults />
        </Stack>
    );
};

export default Search;
