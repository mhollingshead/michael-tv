import { getSeasonDetails } from '../fetchers/onDemandFetchers';

export const storeActiveEvent = (activeEvent) => {
    // Store the active event in localStorage
    localStorage.setItem('active-event', JSON.stringify(activeEvent));
};

export const getActiveEvent = () => {
    // Get the active event from localStorage
    return JSON.parse(localStorage.getItem('active-event')) || {};
};

export const updateWatchCount = (id, title, type, value) => {
    // Get the watch count map
    const watchCounts = getWatchCounts();
    // Update the watch count
    if (watchCounts[type]) {
        if (watchCounts[type][id]) {
            watchCounts[type][id].count = (watchCounts[type][id].count || 0) + value;
        } else {
            watchCounts[type][id] = { title, count: value };
        }
    } else {
        watchCounts[type] = { [id]: { title, count: value } };
    }
    // Store updated watch count map in localStorage
    localStorage.setItem('watch-counts', JSON.stringify(watchCounts));
};

export const getWatchCounts = () => {
    return JSON.parse(localStorage.getItem('watch-counts')) || { tv: {}, movie: {} };
};

export const updateCurrentlyWatching = async (seriesDetail, seasonNumber, episodeNumber) => {
    // Get the currently watching map
    const currentlyWatching = JSON.parse(localStorage.getItem('currently-watching')) || {};
    // Get the season details
    const seasonDetail = await getSeasonDetails(seriesDetail.id, seasonNumber);
    // Find the next episode, start with the next episode of the current season
    let nextSeason = seasonDetail.season_number;
    let nextEpisode = episodeNumber + 1;
    // Find the episode in the current season's episode list
    let episode = seasonDetail.episodes.find((episode) => episode.episode_number === nextEpisode);
    // If the episode wasn't found,
    if (!episode) {
        // Set next episode to episode 1 of the next season
        nextEpisode = 1;
        nextSeason++;
        // If the next season doesn't exist, or if the next season has no episodes, set episode to false
        episode = seriesDetail.seasons.find(
            (season) => season.season_number === nextSeason && season.episode_count
        );
    }
    // If no next episode was found,
    if (!episode) {
        // The series has been finished, so remove it from the currently watching map
        delete currentlyWatching[seriesDetail.id];
    } else {
        // Otherwise, update the entry
        currentlyWatching[seriesDetail.id] = {
            next: { season: nextSeason, episode: nextEpisode },
            title: seriesDetail.name,
            poster: seriesDetail.poster_path,
            lastWatched: +new Date()
        };
    }
    // Save the updated currently watching map in localStorage
    localStorage.setItem('currently-watching', JSON.stringify(currentlyWatching));
};

export const removeFromCurrentlyWatching = (id) => {
    const currentlyWatching = JSON.parse(localStorage.getItem('currently-watching')) || {};
    delete currentlyWatching[id];
    localStorage.setItem('currently-watching', JSON.stringify(currentlyWatching));
};

export const getCurrentlyWatching = () => {
    const currentlyWatchingMap = JSON.parse(localStorage.getItem('currently-watching')) || {};
    return Object.entries(currentlyWatchingMap).map(([id, data]) => ({ id, ...data })).sort((a, b) => b.lastWatched - a.lastWatched);
};

export const getNextEpisode = (id) => {
    const currentlyWatching = JSON.parse(localStorage.getItem('currently-watching')) || {};
    const { season, episode } = currentlyWatching[id]?.next || {};
    return { nextSeason: season || 1, nextEpisode: episode || 1 };
};
