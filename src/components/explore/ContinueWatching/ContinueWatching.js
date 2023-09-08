import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import RenderIfVisible from 'react-render-if-visible';
import ScrollableList from '../../list/ScrollableList/ScrollableList';
import ContinueWatchingListing from '../../list/ContinueWatchingListing';
import { getCurrentlyWatching } from '../../../common/utils/storageUtils';
import './ContinueWatching.scss';

const ContinueWatching = () => {
    const [currentlyWatching, setCurrentlyWatching] = useState(getCurrentlyWatching().slice(0, 20));

    const refreshCurrentlyWatching = () => {
        setCurrentlyWatching(getCurrentlyWatching().slice(0, 20));
    };

    return currentlyWatching.length ? (
        <Box className='ContinueWatching' component='section'>
            <Typography
                className='ContinueWatching__guttered-content'
                variant='h5'
                component='h3'
                fontWeight={700}
            >
                Continue Watching
            </Typography>
            <RenderIfVisible defaultHeight={281} visibleOffset={500}>
                <ScrollableList fadeLeft={false} fadeRight={false}>
                    {currentlyWatching.map((title, j) => (
                        <ContinueWatchingListing
                            title={title}
                            refreshCurrentlyWatching={refreshCurrentlyWatching}
                            key={`continue-watching-${j}`}
                        />
                    ))}
                </ScrollableList>
            </RenderIfVisible>
        </Box>
    ) : null;
};

export default ContinueWatching;
