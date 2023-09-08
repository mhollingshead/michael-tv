import { Link as DomLink } from 'react-router-dom';
import { Box, Stack, Typography, Link, Button } from '@mui/material';
import PlayIcon from '@mui/icons-material/PlayArrow';
import TitleLiveBanner from '../TitleLiveBanner/';
import { getNextEpisode } from '../../../common/utils/storageUtils';
import './TitleHero.scss';

const TitleHero = ({ id, title, overview, date, genres, backdrop, type }) => {
    const { nextSeason, nextEpisode } = getNextEpisode(id);

    return (
        <Box className='TitleHero' component='section'>
            {backdrop && (
                <Box
                    className='TitleHero__backdrop'
                    sx={{
                        backgroundImage: `url("https://image.tmdb.org/t/p/w1280${backdrop}")`
                    }}
                />
            )}
            <TitleLiveBanner title={title} />
            <Stack className='TitleHero__info' spacing={4}>
                <Typography variant='h1'>{title}</Typography>
                <Typography
                    className='TitleHero__overview'
                    variant='body1'
                    onClick={(e) => e.target.classList.toggle('TitleHero__overview--expanded')}
                >
                    {overview}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                    {date} •{' '}
                    <Link
                        component={DomLink}
                        to={`/search?genres=${genres.map(({ id }) => id).join(',')}`}
                    >
                        {genres.map(({ name }) => name).join(', ')}
                    </Link>
                </Typography>
                <Box className='TitleHero__cta'>
                    <Button
                        variant='contained'
                        startIcon={<PlayIcon />}
                        component={DomLink}
                        to={`/watch/${type === 'tv' ? 'series' : type}/${id}${
                            type === 'tv' ? `/${nextSeason}/${nextEpisode}` : ''
                        }`}
                    >
                        {type === 'tv'
                            ? `Season ${nextSeason} Episode ${nextEpisode}`
                            : `Watch ${title}`}
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
};

export default TitleHero;
