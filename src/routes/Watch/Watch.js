import { useEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, IconButton, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Logo from '../../components/header/Logo';
import { getMovieDetails, getSeriesDetails } from '../../common/fetchers/onDemandFetchers';
import { updateCurrentlyWatching, updateWatchCount } from '../../common/utils/storageUtils';
import './Watch.scss';

export const loader = async ({ params }) => {
    const { type, id } = params;
    if (type === 'series') {
        const { season, episode } = params;
        const details = await getSeriesDetails(id);
        return { details, season: +season, episode: +episode };
    } else if (type === 'movie') {
        const details = await getMovieDetails(id);
        return { details };
    }
};

const Watch = () => {
    const navigate = useNavigate();

    const { details, season, episode } = useLoaderData();

    useEffect(() => {
        if (details) {
            updateWatchCount(details.id, details.name || details.title, details.type, 1);
        }
        if (season && episode) {
            updateCurrentlyWatching(details, season, episode);
        }
    }, [details]);

    return (
        <Box className='Watch' component='main'>
            <Stack
                className='Watch__head'
                direction='row'
                alignItems='center'
                justifyContent='space-between'
            >
                <Box width={120}>
                    <IconButton onClick={() => navigate(-1)}>
                        <ArrowBackIcon fontSize='large' />
                    </IconButton>
                </Box>
                <Logo height={3} />
                <Box width={120}></Box>
            </Stack>
            <CircularProgress className='Watch__spinner' size={64} />
        </Box>
    );
};

export default Watch;
