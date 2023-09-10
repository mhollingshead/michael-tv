import { useDispatch, useSelector } from 'react-redux';
import { Link as DomLink } from 'react-router-dom';
import { Box, Link, Stack, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { updateActiveEvent } from '../../../features/live/liveSlice';
import { getLiveEvent } from '../../../common/utils/liveUtils';
import './GuideChannel.scss';

const GuideChannel = ({ channel }) => {
    const dispatch = useDispatch();

    const activeChannelIndex = useSelector((state) => state.live.guide.activeChannel);

    const handleChannelClick = (channelIndex) => {
        dispatch(
            updateActiveEvent({
                activeChannel: channelIndex,
                activeEvent: getLiveEvent(channel, true)
            })
        );
    };

    return (
        <Stack
            className={`GuideChannel ${
                channel.index === activeChannelIndex ? 'GuideChannel--active' : ''
            }`}
            direction='row'
            spacing={3}
            onClick={() => handleChannelClick(channel.index)}
        >
            <img
                className='GuideChannel__channel-logo'
                src={require(`../../../assets/images/${channel.callSign}.png`)}
                alt={channel.name}
            />
            <Stack>
                <Typography variant='body2' color='text.secondary'>
                    {channel.callSign}
                </Typography>
                <Box lineHeight={1}>
                    <Link variant='body2' component={DomLink} underline='hover' to={`/watch/live/${channel.tmdbId}`}>
                        Watch Live
                        <ChevronRightIcon fontSize='small' />
                    </Link>
                </Box>
            </Stack>
        </Stack>
    );
};

export default GuideChannel;
