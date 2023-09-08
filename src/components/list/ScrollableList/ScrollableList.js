import { Box } from '@mui/material';
import './ScrollableList.scss';

const ScrollableList = ({ fadeLeft = true, fadeRight = true, children }) => {
    return (
        <Box
            className={`ScrollableList ${fadeLeft ? 'ScrollableList--fade-left' : ''} ${
                fadeRight ? 'ScrollableList--fade-right' : ''
            }`}
        >
            <Box className='ScrollableList__wrapper'>
                <Box className='ScrollableList__list'>{children}</Box>
            </Box>
        </Box>
    );
};

export default ScrollableList;
