import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link as DomLink } from 'react-router-dom';
import { Box, Chip, Link, Skeleton, Stack, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { getDetailsByName } from '../../../common/fetchers/onDemandFetchers';
import { formatEpisodeInfo, formatTimeRange } from '../../../common/utils/miscUtils';
import './ActiveEventInfo.scss';

const ActiveEventInfo = ({ setBackdrop }) => {
    const channels = useSelector((state) => state.live.programming.channels);
    const activeChannelIndex = useSelector((state) => state.live.guide.activeChannel);
    const activeEventIndex = useSelector((state) => state.live.guide.activeEvent);

    const [tmdbDetails, setTmdbDetails] = useState(null);
    const [activeEvent, setActiveEvent] = useState(null);

    useEffect(() => {
        if (channels[activeChannelIndex]) {
            const event = channels[activeChannelIndex].events[activeEventIndex];
            setActiveEvent(event);

            if (event.program.title && event.type) {
                getDetailsByName(event.program.title, event.type).then((details) => {
                    setBackdrop(details?.backdrop_path);
                    setTmdbDetails(details);
                });
            }
        }
    }, [channels, activeChannelIndex, activeEventIndex]);

    return (
        <Stack className='ActiveEventInfo' component='section' spacing={4}>
            <Stack className='ActiveEventInfo__head' spacing={0.5} height={92}>
                <Typography variant='body2' color='text.secondary'>
                    {activeEvent ? (
                        formatTimeRange(activeEvent.startTime, activeEvent.endTime)
                    ) : (
                        <Skeleton width={100} />
                    )}
                </Typography>
                <Typography variant='h2' fontWeight={700}>
                    {activeEvent ? activeEvent.program.title : <Skeleton width={400} />}
                </Typography>
                {activeEvent ? (
                    <Stack
                        className='ActiveEventInfo__meta'
                        direction='row'
                        alignItems='center'
                        spacing={1}
                    >
                        {activeEvent.rating && (
                            <Typography variant='body2' color='text.secondary'>
                                {activeEvent.rating}
                            </Typography>
                        )}
                        {activeEvent.flags.map((flag) => (
                            <Chip label={flag} color='primary' size='small' key={flag} />
                        ))}
                        {activeEvent.tags.map((tag) => (
                            <Chip label={tag} variant='outlined' size='small' key={tag} />
                        ))}
                    </Stack>
                ) : (
                    <Skeleton width={200} height={24} />
                )}
            </Stack>
            <Stack className='ActiveEventInfo__body' spacing={0.5} height={72}>
                <Typography variant='body2' fontWeight={700}>
                    {activeEvent ? (
                        formatEpisodeInfo(activeEvent.program)
                    ) : (
                        <Skeleton width={200} />
                    )}
                </Typography>
                <Typography variant='body2' color='text.secondary' noWrap>
                    {activeEvent ? activeEvent.program.overview : <Skeleton width={200} />}
                </Typography>
                <Box lineHeight={1}>
                    {tmdbDetails && (
                        <Link
                            variant='body2'
                            component={DomLink}
                            to={`/on-demand/${activeEvent.type === 'movie' ? 'movie' : 'series'}/${
                                tmdbDetails.id
                            }`}
                        >
                            {activeEvent.type === 'movie' ? 'View Movie' : 'More Episodes'}
                            <ChevronRightIcon fontSize='small' />
                        </Link>
                    )}
                </Box>
            </Stack>
        </Stack>
    );
};

export default ActiveEventInfo;
