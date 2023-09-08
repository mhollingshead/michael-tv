import { useEffect } from 'react';
import { Box } from '@mui/material';
import Featured from '../../components/explore/Featured';
import ExploreSections from '../../components/explore/ExploreSections';
import ContinueWatching from '../../components/explore/ContinueWatching';
import './Explore.scss';

const Explore = () => {
    // Scroll to top of the page on mount
    useEffect(() => window.scrollTo(0, 0), []);

    return (
        <Box className='Explore' component='main'>
            <Featured />
            <ContinueWatching />
            <ExploreSections />
        </Box>
    );
};

export default Explore;
