import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Stack, Typography } from '@mui/material';
import { updateActiveEvent } from '../../../features/live/liveSlice';
import { eventIsLive } from '../../../common/utils/liveUtils';
import { formatTimeRange, getEventStyles } from '../../../common/utils/miscUtils';
import './GuideEvent.scss';

const GuideEvent = ({ event, channelIndex, eventIndex, isLast }) => {
    const dispatch = useDispatch();

    const activeChannelIndex = useSelector((state) => state.live.guide.activeChannel);
    const activeEventIndex = useSelector((state) => state.live.guide.activeEvent);

    const [isLive, setIsLive] = useState(eventIsLive(event));

    const handleEventClick = () => {
        dispatch(
            updateActiveEvent({
                activeChannel: channelIndex,
                activeEvent: eventIndex
            })
        );
    };

    useEffect(() => {
        const interval = setInterval(() => setIsLive(eventIsLive(event)), 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <Stack
            className={`GuideEvent ${
                channelIndex === activeChannelIndex && eventIndex === activeEventIndex
                    ? 'GuideEvent--active'
                    : isLive
                    ? 'GuideEvent--live'
                    : ''
            }`}
            justifyContent='center'
            alignItems='flex-start'
            style={getEventStyles(event, isLast)}
            onClick={handleEventClick}
        >
            <Typography variant='body2' fontWeight={700}>
                {event.program.title}
            </Typography>
            <Typography variant='caption' color='text.secondary' fontWeight={400}>
                {formatTimeRange(event.startTime, event.endTime)}
            </Typography>
        </Stack>
    );
};

export default GuideEvent;
