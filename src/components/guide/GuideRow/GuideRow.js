import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Stack } from '@mui/material';
import GuideChannel from '../GuideChannel';
import GuideEvent from '../GuideEvent';
import './GuideRow.scss';

const GuideRow = ({ index, style }) => {
    const channels = useSelector((state) => state.live.programming.channels);
    const channelFilter = useSelector((state) => state.live.guide.channelFilter);

    const [channel, setChannel] = useState(null);

    useEffect(() => {
        if (channels) {
            const filteredChannels = channels
                .map((channel, i) => ({ ...channel, index: i }))
                .filter((_, i) => channelFilter[i]);

            setChannel(filteredChannels[index]);
        }
    }, [channels, channelFilter]);

    return (
        <Stack className='GuideRow' direction='row' spacing={0.5} style={style}>
            {channel && <GuideChannel channel={channel} />}
            {channel && (
                <Box className='GuideEvents'>
                    {channel.events.map((event, i) => (
                        <GuideEvent
                            event={event}
                            channelIndex={channel.index}
                            eventIndex={i}
                            isLast={i === channel.events.length - 1}
                            key={`${channel.callSign}-${event.startTime}`}
                        />
                    ))}
                </Box>
            )}
        </Stack>
    );
};

export default GuideRow;
