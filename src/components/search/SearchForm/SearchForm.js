import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    Autocomplete,
    FormControl,
    FormControlLabel,
    InputAdornment,
    InputLabel,
    TextField,
    OutlinedInput,
    Radio,
    RadioGroup,
    Stack,
    Typography,
    IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { setSearchResults } from '../../../features/search/searchSlice';
import { searchByFilter, searchByQuery } from '../../../common/fetchers/onDemandFetchers';
import { getGenresById, getNetworksById } from '../../../common/utils/onDemandUtils';
import genreMap from '../../../common/data/genres.json';
import channelMap from '../../../common/data/channels.json';
import './SearchForm.scss';

const SearchForm = () => {
    const dispatch = useDispatch();

    const [searchParams, setSearchParams] = useSearchParams();
    // Get the genre and network ids from the search params (if they exist)
    const genreIds = searchParams.get('genres')?.split(',') || [];
    const networkIds = searchParams.get('networks')?.split(',') || [];

    const [type, setType] = useState(searchParams.get('type') || 'all');
    const [query, setQuery] = useState(searchParams.get('query') || '');
    const [genres, setGenres] = useState(getGenresById(genreIds));
    const [networks, setNetworks] = useState(getNetworksById(networkIds));
    const [afterYear, setAfterYear] = useState(searchParams.get('after_year') || '');
    const [beforeYear, setBeforeYear] = useState(searchParams.get('before_year') || '');

    // Helper method to build search params object so we can set the search params each state change
    const buildSearchParams = useCallback(() => {
        const searchParamObject = {};
        if (type && type !== 'all') searchParamObject.type = type;
        if (query) searchParamObject.query = query;
        if (genres.length) searchParamObject.genres = genres.map((genre) => genre.id).join(',');
        if (networks.length)
            searchParamObject.networks = networks.map((network) => network.tmdbId).join(',');
        if (afterYear) searchParamObject.after_year = afterYear;
        if (beforeYear) searchParamObject.before_year = beforeYear;
        return searchParamObject;
    }, [type, query, genres, networks, afterYear, beforeYear]);

    // Because filters cannot be applied to queries, we allow users to search by EITHER
    // query OR filters.

    const getResultsByQuery = useCallback(() => {
        // Update the search params
        setSearchParams(buildSearchParams(), { replace: true });
        // Search by query. Wrap in setTimeout to allow for smooth nav transition
        setTimeout(
            () =>
                searchByQuery(type, query).then((response) => {
                    dispatch(
                        setSearchResults({
                            // Save the results in state
                            ...response,
                            // Save the relevant arguments and search type in state in case more
                            // results need to be requested from outside components
                            args: [type, query],
                            method: 'query'
                        })
                    );
                    // Scroll to the top of the page for the new results
                    window.scrollTo(0, 0);
                }),
            0
        );
    }, [type, query]);

    const getResultsByFilter = useCallback(() => {
        // Update the search params
        setSearchParams(buildSearchParams(), { replace: true });
        // Search by filter. Wrap in setTimeout to allow for smooth nav transition
        setTimeout(
            () =>
                searchByFilter(type, genres, networks, afterYear, beforeYear).then((response) => {
                    dispatch(
                        setSearchResults({
                            // Save the results in state
                            ...response,
                            // Save the relevant arguments and search type in state in case more
                            // results need to be requested from outside components
                            args: [type, genres, networks, afterYear, beforeYear],
                            method: 'filter'
                        })
                    );
                    // Scroll to the top of the page for the new results
                    window.scrollTo(0, 0);
                }),
            0
        );
    }, [type, genres, networks, afterYear, beforeYear]);

    // Any time a user provides a query, the filter inputs should be cleared. Likewise, any
    // time a user provides a filter, the query should be cleared. This way, we know which
    // type of search to make based on which inputs the user last provided.

    // Listen for inputs provided to query-related inputs ONLY
    useEffect(() => {
        // If the user is currently searching by query
        if (query) {
            // Clear any filter-related input state
            setGenres([]);
            setNetworks([]);
            setAfterYear('');
            setBeforeYear('');
            // Get the query results after 500ms of inactivity
            const timeout = setTimeout(getResultsByQuery, 500);
            return () => clearTimeout(timeout);
        } else if (!genres.length && !networks.length && !afterYear && !beforeYear) {
            // If no inputs have been supplied, default to an empty filter search
            getResultsByFilter();
            // Update the search params
            setSearchParams({}, { replace: true });
        }
        // We purposefully leave out dependencies to avoid unwanted rerenders
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    // Listen for inputs provided to filter-related inputs ONLY
    useEffect(() => {
        // If the user is currently searching by filter
        if (genres.length || networks.length || afterYear || beforeYear) {
            // Clear the query input
            setQuery('');
            // Get the filter results after 100ms of inactivity (due to possible input scrolling)
            const timeout = setTimeout(getResultsByFilter, 100);
            return () => clearTimeout(timeout);
        } else if (!query) {
            // If no inputs have been supplied, default to an empty filter search
            getResultsByFilter();
            // Update the search params
            setSearchParams({}, { replace: true });
        }
        // We purposefully leave out dependencies to avoid unwanted rerenders
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [genres, networks, afterYear, beforeYear]);

    // Listen for changes to the result type. This applies to both search methods, so we
    // simply want to redo the previous search
    useEffect(() => {
        // If the most recent search type was a query
        if (query) {
            // Get updated query results
            getResultsByQuery();
        } else {
            // Otherwise, get updated filter results
            getResultsByFilter();
        }
        // We purposefully leave out dependencies to avoid unwanted rerenders
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    // Clear search results on unmount to avoid result flickering on next mount
    useEffect(
        () => () =>
            dispatch(
                setSearchResults({
                    results: [],
                    page: 1,
                    totalPages: 0,
                    args: [],
                    method: 'filter'
                })
            ),
        []
    );

    return (
        <Stack className='SearchForm' spacing={4}>
            <RadioGroup
                aria-labelledby='type-label'
                value={type}
                onChange={(e) => setType(e.target.value)}
                name='type'
                row
            >
                <FormControlLabel
                    value='tv'
                    label='TV Shows'
                    control={<Radio size='small' />}
                    slotProps={{
                        typography: {
                            variant: 'body2'
                        }
                    }}
                />
                <FormControlLabel
                    value='movie'
                    label='Movies'
                    variant='body2'
                    control={<Radio size='small' />}
                    slotProps={{
                        typography: {
                            variant: 'body2'
                        }
                    }}
                />
                <FormControlLabel
                    value='all'
                    label='All'
                    variant='body2'
                    control={<Radio size='small' />}
                    slotProps={{
                        typography: {
                            variant: 'body2'
                        }
                    }}
                />
            </RadioGroup>
            <FormControl>
                <InputLabel htmlFor='search'>Search titles</InputLabel>
                <OutlinedInput
                    id='search'
                    type='text'
                    autoComplete='off'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    endAdornment={
                        <InputAdornment position='end'>
                            <SearchIcon />
                        </InputAdornment>
                    }
                    label='Search titles'
                />
            </FormControl>
            <Typography variant='body1' color='text.secondary'>
                Or, browse with filters
            </Typography>
            <Stack spacing={2}>
                <Autocomplete
                    multiple
                    options={Object.values(genreMap).sort((a, b) =>
                        // Sort alphabetically
                        a.name > b.name ? 1 : a.name < b.name ? -1 : 0
                    )}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    value={genres}
                    onChange={(_, value) => setGenres(value)}
                    renderInput={(params) => <TextField {...params} label='With genres' />}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                />
                <Autocomplete
                    multiple
                    options={Object.values(channelMap).sort((a, b) =>
                        // Sort alphabetically
                        a.name > b.name ? 1 : a.name < b.name ? -1 : 0
                    )}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    value={networks}
                    onChange={(_, value) => setNetworks(value)}
                    renderInput={(params) => <TextField {...params} label='From networks' />}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                />
                <Stack direction='row' gap={2} className='SearchForm__input-group'>
                    <FormControl
                        error={
                            // Year should either be empty or between 1900 and the current year
                            !!afterYear &&
                            (+afterYear < 1900 || +afterYear > new Date().getFullYear())
                        }
                    >
                        <InputLabel htmlFor='after-year'>After year</InputLabel>
                        <OutlinedInput
                            id='after-year'
                            label='After year'
                            value={afterYear}
                            onChange={(e) => setAfterYear(e.target.value)}
                            type='number'
                            inputProps={{
                                min: 1900,
                                max: new Date().getFullYear()
                            }}
                            endAdornment={
                                afterYear ? (
                                    <InputAdornment position='end' onClick={() => setAfterYear('')}>
                                        <IconButton size='small'>
                                            <CloseIcon fontSize='small' />
                                        </IconButton>
                                    </InputAdornment>
                                ) : null
                            }
                        />
                    </FormControl>
                    <FormControl
                        error={
                            // Year should either be empty or between 1900 and the current year
                            !!beforeYear &&
                            (+beforeYear < 1900 || +beforeYear > new Date().getFullYear() + 1)
                        }
                    >
                        <InputLabel htmlFor='before-year'>Before year</InputLabel>
                        <OutlinedInput
                            id='before-year'
                            label='Before year'
                            value={beforeYear}
                            onChange={(e) => setBeforeYear(e.target.value)}
                            type='number'
                            inputProps={{
                                min: 1900,
                                max: new Date().getFullYear() + 1
                            }}
                            endAdornment={
                                beforeYear ? (
                                    <InputAdornment
                                        position='end'
                                        onClick={() => setBeforeYear('')}
                                    >
                                        <IconButton size='small'>
                                            <CloseIcon fontSize='small' />
                                        </IconButton>
                                    </InputAdornment>
                                ) : null
                            }
                        />
                    </FormControl>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default SearchForm;
