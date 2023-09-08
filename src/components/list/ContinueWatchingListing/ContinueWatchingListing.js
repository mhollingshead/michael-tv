import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, IconButton, Menu, MenuItem, Paper, Stack, Typography } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { removeFromCurrentlyWatching } from '../../../common/utils/storageUtils';
import defaultPoster from '../../../assets/images/poster.png';
import './ContinueWatchingListing.scss';

// This is essentially the same component as TitleListing, just with slightly different
// title info and an added menu for removing the title from the continue watching list

const ContinueWatchingListing = ({ title, refreshCurrentlyWatching }) => {
    const [anchor, setAnchor] = useState(null);
    const open = Boolean(anchor);

    const handleClick = (e) => setAnchor(e.currentTarget);

    const handleClose = () => setAnchor(null);

    const handleRemove = () => {
        removeFromCurrentlyWatching(title.id);
        handleClose();
        refreshCurrentlyWatching();
    };

    return (
        <Stack className='ContinueWatchingListing' spacing={0.5}>
            <Paper className='ContinueWatchingListing__poster' elevation={5}>
                <Link
                    className='ContinueWatchingListing__link'
                    to={`/on-demand/series/${title.id}`}
                >
                    <img
                        src={
                            title.poster
                                ? `https://image.tmdb.org/t/p/w342${title.poster}`
                                : defaultPoster
                        }
                        width={154}
                        height={230}
                        loading='lazy'
                        alt={title.title}
                    />
                </Link>
                <Box className='ContinueWatchingListing__menu-wrapper'>
                    <IconButton
                        id={`menu-trigger-${title.id}`}
                        size='small'
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup='true'
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        <MoreHorizIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchor}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': `menu-trigger-${title.id}`
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem onClick={handleRemove}>
                            <Typography variant='body2'>Remove</Typography>
                        </MenuItem>
                    </Menu>
                </Box>
            </Paper>
            <Typography variant='body2' fontWeight={700} noWrap>
                {title.title}
            </Typography>
            <Typography variant='caption' color='text.secondary' fontWeight={400}>
                {`Season ${title.next.season} Episode ${title.next.episode}`}
            </Typography>
        </Stack>
    );
};

export default ContinueWatchingListing;
