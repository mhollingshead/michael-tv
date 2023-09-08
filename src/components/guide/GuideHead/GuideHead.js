import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Stack, TextField, Typography } from '@mui/material';
import { filterChannels } from '../../../features/live/liveSlice';
import { formatTime } from '../../../common/utils/miscUtils';
import './GuideHead.scss';

const GuideHead = () => {
    const dispatch = useDispatch();

    const slots = useSelector((state) => state.live.programming.slots);

    const [filterQuery, setFilterQuery] = useState('');

    useEffect(() => {
        dispatch(filterChannels(filterQuery));
    }, [filterQuery]);

    return (
        <Stack className='GuideHead' direction='row' spacing={0.5}>
            <Box className='GuideHead__channel'>
                <TextField
                    id='channel-filter'
                    placeholder='Filter channels'
                    variant='standard'
                    margin='none'
                    size='small'
                    fullWidth
                    value={filterQuery}
                    autoComplete='off'
                    onChange={(e) => setFilterQuery(e.target.value)}
                />
            </Box>
            <Box className='GuideHead__slots'>
                {slots.map((slot) => (
                    <Box className='GuideHead__slot' key={+slot}>
                        <Typography variant='body2' color='text.secondary'>
                            {formatTime(slot)}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Stack>
    );
};

export default GuideHead;
