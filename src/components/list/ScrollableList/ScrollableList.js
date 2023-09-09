import { Box } from '@mui/material';
import './ScrollableList.scss';

const ScrollableList = ({ children }) => {
    return (
        <Box className='ScrollableList'>
            <Box className='ScrollableList__wrapper'>
                <Box className='ScrollableList__list'>{children}</Box>
            </Box>
        </Box>
    );
};

export default ScrollableList;
