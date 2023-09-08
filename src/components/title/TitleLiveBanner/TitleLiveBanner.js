import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Stack, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { getLiveEvent } from '../../../common/utils/liveUtils';
import { formatEpisodeInfo } from '../../../common/utils/miscUtils';
import './TitleLiveBanner.scss';

const TitleLiveBanner = ({ title }) => {
    const channels = useSelector((state) => state.live.programming.channels);

    // Stores channel data for a channel that's currently airing this title
    // or null if no channel is currently airing this title
    const [liveChannel, setLiveChannel] = useState(null);

    useEffect(() => {
        if (channels) {
            // Find a channel that's currently playing this program
            const liveChannel = channels.find(
                (channel) => getLiveEvent(channel)?.program.title === title
            );
            // If a channel was found, set liveChannel
            if (liveChannel) {
                setLiveChannel({ ...liveChannel, liveEvent: getLiveEvent(liveChannel) });
            } else {
                setLiveChannel(null);
            }
        }
    }, [channels, title]);

    return liveChannel ? (
        <Stack
            className='TitleLiveBanner'
            direction='row'
            alignItems='center'
            spacing={4}
        >
            <img
                className='TitleLiveBanner__channel-logo'
                src={require(`../../../assets/images/${liveChannel.callSign}.png`)}
                alt={liveChannel.name}
            />
            <Stack>
                <Typography variant='body2' fontWeight={700}>
                    Live on {liveChannel.name}
                </Typography>
                {liveChannel.liveEvent.program && (
                    <Typography variant='body2' color='text.secondary'>
                        { formatEpisodeInfo(liveChannel.liveEvent.program) }
                    </Typography>
                )}
            </Stack>
            <Button
                variant='text'
                endIcon={<ChevronRightIcon fontSize='small' />}
                sx={{ ml: 'auto !important' }}
            >
                Watch Live
            </Button>
        </Stack>
    ) : null;
};

export default TitleLiveBanner;
