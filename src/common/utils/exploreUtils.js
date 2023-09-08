import { getPopular, getRecent, getRecommended, getTrending } from '../fetchers/onDemandFetchers';
import { getWatchCounts } from './storageUtils';

// The probability that a movie will be given a recommended section over a tv series.
// 0.25 means the ratio of movies to tv series should be 1:3
const RECOMMEND_MOVIE_THRESHOLD = 0.25;

// The probability that a recommendation (because you watched...) should be featured over a 
// trending/popular/recent title
// 0.75 means the ratio of recommendations to default sections should be 3:1
const FEATURE_RECOMMENDATION_THRESHOLD = 0.75;

// These utilities are used to build the recommendation lists and featured titles on the explore page.
// They use a combination of weighting to ensure relevancy and randomness to ensure variety.

// 1. Begin by extracting user watch counts from the localStorage.
//    - Separate counts are maintained for movies and TV series.
//    - Each count maps titles to the number of times the user has watched them.

// 2. Choose titles to create recommendation lists around. After default sections (trending, recent
//    releases, popular), there are 6 'because you watched' sections.
//    - Shuffle movie and series watch count arrays, then sort by watch count descending.
//    - As long as there are fewer than 6 recommendation titles and the pool is not exhausted:
//        - If both movies and TV series are available:
//            - Use a random number and the recommend movie threshold to decide tv series or movie selection.
//              By default, tv series are favored 3:1
//            - Use a weighted random number generator to index the watch history. Titles at the beginning
//              of the array are most likely, titles at the end are least likely.
//        - If only movies or TV series remain, choose from that pool.

// 3. Fetch trending, recently released, popular, and recommended lists.

// 4. Choose 6 individual titles to feature in the explore page hero.
//    - Titles can be selected from default pool (trending, recent, popular) or the 'recommended' pool.
//    - Default lists are added to the default pool, ordered by likelihood of producing a featured title.
//      By default, trending tv > popular tv > trending movie > recent tv > popular movie > recent movie
//    - For each featured title:
//        - If recommendation lists are available:
//            - Use a random number and feature recommendation threshold to decide default or recommendation
//              selection
//            - Choose a title from the list using the weighted random number generator.
//        - If no recommendation lists remain, populate the featured section from default lists.

// 5. The outcome is 6-12 lists of titles:
//    - trending (tv and movie), recently released (tv and movie), popular (tv and movie)
//    - 0-6 'because you watched' recommendations (tv or movie)
//    and 6 featured titles chosen from the lists.

const weightedRandom = (min, max) => {
    // Return a value between min and max inclusive where the probability p of min to max is
    // p min > p min + 1 > p min + 2 > ... > p max
    return Math.round(max / (Math.random() * max + min));
};

const chooseWatchHistoryRecommendations = (tvWatchHistory, movieWatchHistory) => {
    // Sort tv and movie watch histories by the watch frequency
    const sortedTvWatchHistory = tvWatchHistory
        .sort(() => 0.5 < Math.random())
        .sort((a, b) => b.count - a.count);
    const sortedMovieWatchHistory = movieWatchHistory
        .sort(() => 0.5 < Math.random())
        .sort((a, b) => b.count - a.count);
    // Initialize empty recommendations array
    const watchHistoryRecommendations = [];
    // While there are less than 6 recommendations and there are still possible titles to add
    while (
        watchHistoryRecommendations.length < 6 &&
        sortedTvWatchHistory.length + sortedMovieWatchHistory.length > 0
    ) {
        // If there are both tv series and movies remaining
        if (sortedTvWatchHistory.length && sortedMovieWatchHistory.length) {
            // If random number is below the movie recommendation threshold
            if (Math.random() < RECOMMEND_MOVIE_THRESHOLD) {
                // Remove a weighted random value from the movieWatchHistory array and add it to recommendations
                watchHistoryRecommendations.push(
                    sortedMovieWatchHistory.splice(
                        // This should give the highest chance of adding the first value (the most watched),
                        // with the least chance of adding the last value
                        weightedRandom(1, sortedMovieWatchHistory.length) - 1,
                        1
                    )[0]
                );
            } else {
                // Otherwise, remove a weighted random value from the movieTvHistory array and add it to recommendations
                watchHistoryRecommendations.push(
                    sortedTvWatchHistory.splice(
                        weightedRandom(1, sortedTvWatchHistory.length) - 1,
                        1
                    )[0]
                );
            }
        } else if (sortedTvWatchHistory.length) {
            // Else if there are only tv series remaining, add a tv series using weighted randomness
            watchHistoryRecommendations.push(
                sortedTvWatchHistory.splice(
                    weightedRandom(1, sortedTvWatchHistory.length) - 1,
                    1
                )[0]
            );
        } else {
            // Finally, if only movies remain, add a movie using weighted randomness
            watchHistoryRecommendations.push(
                sortedMovieWatchHistory.splice(
                    weightedRandom(1, sortedMovieWatchHistory.length) - 1,
                    1
                )[0]
            );
        }
    }

    return watchHistoryRecommendations;
};

const chooseFeatured = (trending, recent, popular, recommended) => {
    // Order the default sections by how often they should occur
    const defaultSections = [
        trending.tv,
        popular.tv,
        trending.movie,
        recent.tv,
        popular.movie,
        recent.movie
    ];
    // Filter out empty recommendation lists
    recommended = recommended.filter((recommendation) => recommendation.list?.length);
    // Initialize empty featured array
    const featured = [];
    // While there are less than 6 featured titles
    while (featured.length < 6) {
        // If there are recommended titles to add
        if (recommended.length) {
            // If random number is beneath the feature recommendation threshold
            if (Math.random() < FEATURE_RECOMMENDATION_THRESHOLD) {
                // Remove a recommendation from the recommended list and add it to the featured array
                const { heading, list } = recommended.splice(
                    weightedRandom(1, recommended.length) - 1,
                    1
                )[0];
                featured.push({
                    heading,
                    details: list[weightedRandom(1, list.length) - 1]
                });
            } else {
                // Otherwise, remove a title from a default section and add it to the featured array
                const { heading, list } =
                    defaultSections[weightedRandom(1, defaultSections.length) - 1];
                featured.push({
                    heading,
                    details: list.splice(weightedRandom(1, list.length) - 1, 1)[0]
                });
            }
        } else {
            // If no recommended titles are left, choose a default section to add to the featured array
            const { heading, list } = defaultSections[weightedRandom(1, defaultSections.length) - 1];
            featured.push({
                heading,
                details: list.splice(weightedRandom(1, list.length) - 1, 1)[0]
            });
        }
    }

    return featured;
};

export const getExploreLists = async () => {
    const watchCounts = getWatchCounts();

    // Get tv and movie watch histories from localStorage and convert to objects:
    const tvWatchHistory = Object.entries(watchCounts.tv || {}).map(([id, data]) => ({
        id,
        ...data,
        type: 'tv'
    }));
    const movieWatchHistory = Object.entries(watchCounts.movie || {}).map(([id, data]) => ({
        id,
        ...data,
        type: 'movie'
    }));

    // Select up to 6 tv series or movies to fetch recommendations for using weighted randomness.
    // Tv series should be favored over movies, and more frequently watched tv series and movies
    // should be favored over less frequently watched, but there should still be variety.
    const recommendations = chooseWatchHistoryRecommendations(tvWatchHistory, movieWatchHistory);

    const [
        trendingTv,
        trendingMovie,
        recentTv,
        recentMovie,
        popularTv,
        popularMovie,
        ...recommended
    ] = await Promise.all([
        getTrending('tv'),
        getTrending('movie'),
        getRecent('tv'),
        getRecent('movie'),
        getPopular('tv'),
        getPopular('movie'),
        ...recommendations.map((title) => getRecommended(title.id, title.type))
    ]);

    // A title is featured eligible if it has a backdrop, is english, and has not been watched
    const isFeaturedEligible = (title) =>
        title.backdrop_path &&
        title.original_language === 'en' &&
        !watchCounts[title.media_type][title.id];

    return {
        sections: [
            {
                heading: 'Trending',
                sections: [
                    {
                        heading: 'TV Series',
                        list: trendingTv
                    },
                    {
                        heading: 'Movies',
                        list: trendingMovie
                    }
                ]
            },
            {
                heading: 'Recently Released',
                sections: [
                    {
                        heading: 'TV Series',
                        list: recentTv
                    },
                    {
                        heading: 'Movies',
                        list: recentMovie
                    }
                ]
            },
            {
                heading: 'Popular',
                sections: [
                    {
                        heading: 'TV Series',
                        list: popularTv
                    },
                    {
                        heading: 'Movies',
                        list: popularMovie
                    }
                ]
            },
            ...recommended.map((list, i) => ({
                heading: `Because you watched ${recommendations[i].title}`,
                list
            }))
        ],
        featured: chooseFeatured(
            {
                tv: {
                    heading: 'Trending',
                    list: trendingTv.filter(isFeaturedEligible)
                },
                movie: {
                    heading: 'Trending',
                    list: trendingMovie.filter(isFeaturedEligible)
                }
            },
            {
                tv: {
                    heading: 'Recently Released',
                    list: recentTv.filter(isFeaturedEligible)
                },
                movie: {
                    heading: 'Recently Released',
                    list: recentMovie.filter(isFeaturedEligible)
                }
            },
            {
                tv: {
                    heading: 'Popular',
                    list: popularTv.filter(isFeaturedEligible)
                },
                movie: {
                    heading: 'Popular',
                    list: popularMovie.filter(isFeaturedEligible)
                }
            },
            recommended.map((results, i) => ({
                heading: `Because you watched ${recommendations[i].title}`,
                list: results.filter(isFeaturedEligible)
            }))
        )
    };
};
