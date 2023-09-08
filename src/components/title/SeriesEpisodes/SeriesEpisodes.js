import { useEffect, useState } from 'react';
import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import ScrollableList from '../../list/ScrollableList';
import EpisodeListing from '../../list/EpisodeListing';
import { getSeasonDetails } from '../../../common/fetchers/onDemandFetchers';
import { getNextEpisode } from '../../../common/utils/storageUtils';
import './SeriesEpisodes.scss';

const SeriesEpisodes = ({ series }) => {
    const seasons = series.seasons.filter((season) => season.season_number && season.episode_count);

    const { nextSeason } = getNextEpisode(series.id);

    const [activeSeason, setActiveSeason] = useState(nextSeason);
    const [episodes, setEpisodes] = useState([]);

    useEffect(() => {
        getSeasonDetails(series.id, activeSeason).then((season) =>
            setEpisodes(season.episodes || [])
        );
    }, [activeSeason, series]);

    return (
        <Stack className='SeriesEpisodes'>
            <Typography
                className='SeriesEpisodes__guttered-content'
                variant='h4'
                component='h2'
                fontWeight={700}
            >
                Episodes
            </Typography>
            <Box className='SeriesEpisodes__guttered-content'>
                <Tabs
                    value={activeSeason}
                    variant='scrollable'
                    onChange={(_, value) => setActiveSeason(value)}
                >
                    {seasons.map(({ season_number }) => (
                        <Tab
                            value={season_number}
                            label={`Season ${season_number}`}
                            key={season_number}
                        />
                    ))}
                </Tabs>
            </Box>
            <ScrollableList fadeRight={false} key={episodes[0]?.id || activeSeason}>
                {episodes.length
                    ? episodes.map((episode) => (
                          <EpisodeListing
                              episode={episode}
                              fallbackPoster={series.backdrop_path}
                              link={`/watch/series/${series.id}/${episode.season_number}/${episode.episode_number}`}
                              key={episode.id}
                          />
                      ))
                    : new Array(6).fill().map((_, i) => <EpisodeListing key={i} />)}
            </ScrollableList>
        </Stack>
    );
};

export default SeriesEpisodes;
