import genreMap from '../data/genres.json';
import networkMap from '../data/channels.json';

export const getGenresById = (ids) => {
    if (!ids) return [];
    // Return a list of genre entries for the given ids
    return Object.values(genreMap).filter((genre) => ids.includes(genre.id));
};

export const getNetworksById = (ids) => {
    if (!ids) return [];
    // Return a list of network objects for the given ids
    return Object.values(networkMap).filter((network) => ids.includes(network.tmdbId + ''));
};
