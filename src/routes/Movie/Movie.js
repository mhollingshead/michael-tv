import { useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Box } from '@mui/material';
import TitleHero from '../../components/title/TitleHero';
import RecommendedTitles from '../../components/title/RecommendedTitles';
import { getMovieDetails } from '../../common/fetchers/onDemandFetchers';
import './Movie.scss';

export const loader = async ({ params }) => {
    const details = await getMovieDetails(params.id);
    return { details };
};

const Movie = () => {
    const { details } = useLoaderData();

    // Scroll to top of the page on mount or movie change
    useEffect(() => window.scrollTo(0, 0), [details]);

    return (
        <Box component='main'>
            <TitleHero
                id={details.id}
                title={details.title}
                overview={details.overview}
                date={details.release_date.slice(0, 4)}
                genres={details.genres}
                backdrop={details.backdrop_path}
                type='movie'
            />
            <RecommendedTitles id={details.id} type='movie' key={`${details.id}-recommended`} />
        </Box>
    );
};

export default Movie;
