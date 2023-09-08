import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Skeleton, Stack, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import './ActiveChannelInfo.scss';

const ActiveChannelInfo = () => {
    const channels = useSelector((state) => state.live.programming.channels);
    const activeChannelIndex = useSelector((state) => state.live.guide.activeChannel);

    const [activeChannel, setActiveChannel] = useState(null);

    useEffect(() => {
        if (channels[activeChannelIndex]) {
            setActiveChannel(channels[activeChannelIndex]);
        }
    }, [channels, activeChannelIndex]);

    return (
        <Stack
            className='ActiveChannelInfo'
            component='section'
            direction='row'
            alignItems='center'
            gap={4}
        >
            {activeChannel ? (
                <img
                    className='ActiveChannelInfo__channel-logo'
                    src={require(`../../../assets/images/${activeChannel.callSign}.png`)}
                    alt={activeChannel.name}
                    width='96'
                    height='54'
                />
            ) : (
                <Skeleton variant='rounded' width={96} height={54} />
            )}
            <Stack spacing={0}>
                <Typography variant='h5' color='text.primary' fontWeight={700}>
                    {activeChannel ? activeChannel.name : <Skeleton width={150} />}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                    {activeChannel ? activeChannel.callSign : <Skeleton width={100} />}
                </Typography>
            </Stack>
            <Stack className='ActiveChannelInfo__buttons' spacing={2} direction='row'>
                {activeChannel ? (
                    <Button
                        component={Link}
                        to={`/search?networks=${activeChannel.tmdbId}`}
                        endIcon={<ChevronRightIcon fontSize='small' />}
                    >
                        More from {activeChannel.name}
                    </Button>
                ) : (
                    <Skeleton width={200} height={38.5} />
                )}
                {activeChannel ? (
                    <Button
                        variant='contained'
                        endIcon={<ChevronRightIcon fontSize='small' />}
                        component={Link}
                        to={`/watch/live/${activeChannel.tmdbId}`}
                    >
                        Watch Live
                    </Button>
                ) : (
                    <Skeleton width={133} height={38.5} />
                )}
            </Stack>
        </Stack>
    );
};

export default ActiveChannelInfo;
