import { useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Box } from '@mui/material';
import TitleHero from '../../components/title/TitleHero';
import SeriesEpisodes from '../../components/title/SeriesEpisodes';
import RecommendedTitles from '../../components/title/RecommendedTitles';
import { getSeriesDetails } from '../../common/fetchers/onDemandFetchers';
import { formatYearRange } from '../../common/utils/miscUtils';
import './Series.scss';

export const loader = async ({ params }) => {
    const details = await getSeriesDetails(params.id);
    return { details };
};

const Series = () => {
    const { details } = useLoaderData();

    // Scroll to top of the page on mount or series change
    useEffect(() => window.scrollTo(0, 0), [details]);

    return (
        <Box component='main'>
            <TitleHero
                id={details.id}
                title={details.name}
                overview={details.overview}
                date={formatYearRange(details.first_air_date, details.last_air_date)}
                genres={details.genres}
                backdrop={details.backdrop_path}
                type='tv'
            />
            <SeriesEpisodes series={details} key={`${details.id}-episodes`} />
            <RecommendedTitles id={details.id} type='tv' key={`${details.id}-recommended`} />
        </Box>
    );
};

export default Series;
