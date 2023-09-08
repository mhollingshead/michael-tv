import { useState } from 'react';
import { Box } from '@mui/material';
import ActiveChannelInfo from '../../components/guide/ActiveChannelInfo';
import ActiveEventInfo from '../../components/guide/ActiveEventInfo';
import GuideHead from '../../components/guide/GuideHead';
import LazyGuideGrid from '../../components/guide/LazyGuideGrid';
import './Live.scss';

const Live = () => {
    const [backdrop, setBackdrop] = useState(null);

    return (
        <Box className='Live' component='main'>
            <Box className='Live__sticky'>
                <Box className='Live__backdrop-container'>
                    {backdrop && <Box
                        className='Live__backdrop'
                        sx={{
                            backgroundImage: `url("https://image.tmdb.org/t/p/w1280${backdrop}")`
                        }}
                    />}
                    <ActiveChannelInfo />
                    <ActiveEventInfo setBackdrop={setBackdrop} />
                </Box>
                <GuideHead />
            </Box>
            <LazyGuideGrid />
        </Box>
    );
};

export default Live;
