import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import './LiveIndicator.scss';

const LiveIndicator = () => {
    const slots = useSelector((state) => state.live.programming.slots);

    const [indicatorLeft, setIndicatorLeft] = useState(0);

    const updateLiveIndicator = useCallback(() => {
        // Get the difference between the current date and first block
        const difference = (new Date() - slots[0]) / 60000;
        // Divide difference in minutes between total block minutes
        const left = (difference / 120) * 100;

        setIndicatorLeft(left);
    }, [slots]);

    useEffect(() => {
        // Immediately update the live indicator
        updateLiveIndicator();
        // Update the live indicator every 500ms
        const interval = setInterval(updateLiveIndicator, 500);
        return () => clearInterval(interval);
    }, [slots, updateLiveIndicator]);

    return (
        indicatorLeft && (
            <Box className='LiveIndicator'>
                <Box className='LiveIndicator__wrapper'>
                    <div className='LiveIndicator__bar' style={{ left: `${indicatorLeft}%` }} />
                </Box>
            </Box>
        )
    );
};

export default LiveIndicator;
