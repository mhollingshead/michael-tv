import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

export const getSeriesDetails = (id) =>
    axios
        .get(BASE_URL + `/tv/${id}` + '?language=en-US' + `&api_key=${API_KEY}`)
        .then(({ data }) => ({ ...data, type: 'tv' }))
        .catch(() => {});

export const getMovieDetails = (id) =>
    axios
        .get(BASE_URL + `/movie/${id}` + '?language=en-US' + `&api_key=${API_KEY}`)
        .then(({ data }) => ({ ...data, type: 'movie' }))
        .catch(() => {});

export const getSeasonDetails = (id, season) =>
    axios
        .get(BASE_URL + `/tv/${id}/season/${season}` + '?language=en-US' + `&api_key=${API_KEY}`)
        .then(({ data }) => data)
        .catch(() => []);

export const getDetailsByName = (name, type) => {
    if (['news', 'sports'].includes(type)) type = 'tv';
    return axios
        .get(
            BASE_URL +
                `/search/${type}` +
                '?language=en-US' +
                '&page=1' +
                `&query=${encodeURIComponent(name)}` +
                `&api_key=${API_KEY}`
        )
        .then(
            ({ data: { results } }) =>
                // Because we only have the title to work with, we can't guarantee that we'll receive
                // the correct result. The search endpoint's result order seems to be effected by
                // popularity (i.e. 'Guardians of the Galaxy' returns 'Guardians of the Galaxy Vol. 3
                // as the first result). So, we look for the first result whose title matches our query
                // exactly. If nothing is found, we return the first result as a fallback
                results.find((result) => (result.name || result.title) === name) || results[0]
        )
        .catch(() => {});
};

export const getRecommended = (id, type) =>
    axios
        .get(
            BASE_URL + `/${type}/${id}/recommendations` + '?language=en-US' + `&api_key=${API_KEY}`
        )
        .then(({ data }) => data.results || []);

const discoverMovies = (genres, afterYear, beforeYear, page) =>
    axios
        .get(
            BASE_URL +
                '/discover/movie' +
                '?language=en-US' +
                `&page=${page}` +
                '&sort_by=popularity.desc' +
                `&with_genres=${genres.join(',')}` +
                (afterYear ? `&primary_release_date.gte=${afterYear}-01-01` : '') +
                (beforeYear ? `&primary_release_date.lte=${beforeYear}-01-01` : '') +
                '&with_original_language=en' +
                `&api_key=${API_KEY}`
        )
        .then(({ data }) => data);

const discoverTV = (genres, networks, afterYear, beforeYear, page) =>
    axios
        .get(
            BASE_URL +
                '/discover/tv' +
                '?language=en-US' +
                `&page=${page}` +
                '&sort_by=popularity.desc' +
                `&with_genres=${genres.join(',')}` +
                `&with_networks=${networks.join('|')}` +
                (afterYear ? `&air_date.gte=${afterYear}-01-01` : '') +
                (beforeYear ? `&air_date.lte=${beforeYear}-01-01` : '') +
                '&with_original_language=en' +
                `&api_key=${API_KEY}`
        )
        .then(({ data }) => data);

const searchMovies = (query, page) =>
    axios
        .get(
            BASE_URL +
                '/search/movie' +
                '?language=en-US' +
                `&page=${page}` +
                `&query=${encodeURIComponent(query)}` +
                `&api_key=${API_KEY}`
        )
        .then(({ data }) => data);

const searchTV = (query, page) =>
    axios
        .get(
            BASE_URL +
                '/search/tv' +
                '?language=en-US' +
                `&page=${page}` +
                `&query=${encodeURIComponent(query)}` +
                `&api_key=${API_KEY}`
        )
        .then(({ data }) => data);

export const getTrending = (type) =>
    axios
        .get(BASE_URL + `/trending/${type}/week` + '?language=en-US' + `&api_key=${API_KEY}`)
        .then(({ data }) => data.results)
        .catch(() => {});

export const getRecent = (type) =>
    axios
        .get(
            BASE_URL +
                `/discover/${type}` +
                '?language=en-US' +
                '&page=1' +
                '&sort_by=primary_release_date.desc' +
                '&vote_count.gte=25' +
                '&with_original_language=en' +
                `&api_key=${API_KEY}`
        )
        .then(({ data }) => data.results.map((title) => ({ ...title, media_type: type })))
        .catch(() => {});

export const getPopular = (type) =>
    axios
        .get(
            BASE_URL +
                `/discover/${type}` +
                '?language=en-US' +
                '&page=1' +
                '&sort_by=popularity.desc' +
                '&vote_count.gte=25' +
                '&with_original_language=en' +
                `&api_key=${API_KEY}`
        )
        .then(({ data }) => data.results.map((title) => ({ ...title, media_type: type })))
        .catch(() => {});

export const searchByFilter = async (
    type,
    genres = [],
    networks = [],
    afterYear = '',
    beforeYear = '',
    page = 1
) => {
    // Map genres and networks to their ids
    genres = genres.map((genre) => genre.id);
    networks = networks.map((network) => network.tmdbId);

    if (type === 'all' && !networks.length) {
        // Request results for both movies and tv shows with the supplied filters
        const responses = await Promise.all([
            discoverMovies(genres, afterYear, beforeYear, page),
            discoverTV(genres, networks, afterYear, beforeYear, page)
        ]);
        // Get the max total pages for either tv or movies
        const totalPages = Math.max(responses[0].total_pages, responses[1].total_pages);
        // Flatten the result lists and sort by popularity descending
        const results = responses
            .map((response) => response.results)
            .flat()
            .sort((a, b) => b.popularity - a.popularity);
        // Return the final results
        return { results, page: responses[0].page, totalPages };
    } else if (type === 'movie') {
        // Movies can't be filtered by network, so return empty array
        if (networks.length) return { results: [], page: 1, totalPages: 0 };

        const response = await discoverMovies(genres, afterYear, beforeYear, page);
        // Sort results by popularity descending
        const results = response.results.sort((a, b) => b.popularity - a.popularity);
        // Return the final results
        return { results, page: response.page, totalPages: response.total_pages };
    } else {
        const response = await discoverTV(genres, networks, afterYear, beforeYear, page);
        // Sort results by popularity descending
        const results = response.results.sort((a, b) => b.popularity - a.popularity);
        // Return the final results
        return { results, page: response.page, totalPages: response.total_pages };
    }
};

export const searchByQuery = async (type, query, page = 1) => {
    if (type === 'all') {
        const responses = await Promise.all([searchMovies(query, page), searchTV(query, page)]);
        // Get the max total pages for either tv or movies
        const totalPages = Math.max(responses[0].total_pages, responses[1].total_pages);
        // Flatten the result lists and sort by popularity descending
        const results = responses
            .map((response) => response.results)
            .flat()
            .sort((a, b) => b.popularity - a.popularity);
        // Return the final results
        return { results, page: responses[0].page, totalPages };
    } else if (type === 'movie') {
        const response = await searchMovies(query, page);
        // Sort results by popularity descending
        const results = response.results.sort((a, b) => b.popularity - a.popularity);
        // Return the final results
        return { results, page: response.page, totalPages: response.total_pages };
    } else {
        const response = await searchTV(query, page);
        // Sort results by popularity descending
        const results = response.results.sort((a, b) => b.popularity - a.popularity);
        // Return the final results
        return { results, page: response.page, totalPages: response.total_pages };
    }
};
