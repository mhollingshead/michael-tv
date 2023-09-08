import { createRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FixedSizeList } from 'react-window';
import { Box } from '@mui/material';
import LiveIndicator from '../LiveIndicator';
import GuideRow from '../GuideRow';
import './LazyGuideGrid.scss';

const LazyGuideGrid = () => {
    const listRef = createRef();

    const channels = useSelector((state) => state.live.programming.channels);
    const channelFilter = useSelector((state) => state.live.guide.channelFilter);
    const channelCount = channelFilter.filter((channel) => channel).length;
    const activeChannelIndex = useSelector((state) => state.live.guide.activeChannel);

    useEffect(() => {
        if (listRef.current) {
            // Map channels to the filtered channel array
            const filteredChannels = channels
                .map((channel, i) => ({ ...channel, index: i }))
                .filter((_, i) => channelFilter[i]);
            // Find the active channel
            const activeChannel = filteredChannels.find(
                (channel) => channel.index === activeChannelIndex
            );
            // Get the index of the active channel in the filtered channel array
            const index = filteredChannels.indexOf(activeChannel);
            // Scroll to the active channel
            listRef.current.scrollToItem(index, 'center');
        }
    }, [listRef.current]);

    return (
        <Box className='LazyGuideGrid'>
            <FixedSizeList
                itemCount={channelCount}
                itemSize={100}
                height={window.innerHeight - 458}
                width='100%'
                ref={listRef}
            >
                {GuideRow}
            </FixedSizeList>
            <LiveIndicator />
        </Box>
    );
};

export default LazyGuideGrid;
