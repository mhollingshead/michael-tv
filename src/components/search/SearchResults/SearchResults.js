import { useDispatch, useSelector } from 'react-redux';
import { Box, Button } from '@mui/material';
import TitleListing from '../../list/TitleListing';
import { addSearchResults } from '../../../features/search/searchSlice';
import { searchByFilter, searchByQuery } from '../../../common/fetchers/onDemandFetchers';
import './SearchResults.scss';

const SearchResults = () => {
    const dispatch = useDispatch();

    const results = useSelector((state) => state.search.results);
    const page = useSelector((state) => state.search.page);
    const totalPages = useSelector((state) => state.search.totalPages);
    const method = useSelector((state) => state.search.options.method);
    const args = useSelector((state) => state.search.options.args);

    const getNextPage = () => {
        // If the search type was a query
        if (method === 'query') {
            // Get the next page of search results using the previous arguments
            searchByQuery(...args, page + 1).then((response) => {
                dispatch(addSearchResults({ ...response, page: response.page }));
            });
        } else {
            // Otherwise, get the next page of filter results using the previous arguments
            searchByFilter(...args, page + 1).then((response) => {
                dispatch(addSearchResults({ ...response, page: response.page }));
            });
        }
    };

    return (
        <Box className='SearchResults' component='section'>
            {results.map((result) => (
                <TitleListing title={result} key={`${result.name || result.title}-${result.id}`} />
            ))}
            {page < totalPages && (
                <Box className='SearchResults__more-row'>
                    <Button onClick={getNextPage} variant='contained'>
                        See more
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default SearchResults;
