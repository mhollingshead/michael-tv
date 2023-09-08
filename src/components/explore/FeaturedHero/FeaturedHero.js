import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Stack, Typography, useColorScheme } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import palette from 'image-palette';
import pixels from 'image-pixels';
import { getFeaturedHeroStyles } from '../../../common/utils/miscUtils';
import genreMap from '../../../common/data/genres.json';
import './FeaturedHero.scss';

const FeaturedHero = ({ heading, details }) => {
    const { mode } = useColorScheme();
    const [colors, setColors] = useState(null);

    useEffect(() => {
        if (details) {
            // Once we have access to the backdrop path, extract the color palette
            pixels(`https://image.tmdb.org/t/p/w300${details.backdrop_path}`, 1)
                .then(palette)
                .then(({ colors }) => setColors(colors));
        }
    }, [details]);

    return (
        <Box className='FeaturedHero'>
            <Box
                className='FeaturedHero__backdrop'
                sx={colors && getFeaturedHeroStyles(colors, mode, details)}
            />
            <Stack className='FeaturedHero__info' spacing={4}>
                <Typography
                    variant='body2'
                    sx={{ textTransform: 'uppercase', letterSpacing: '2px' }}
                >
                    {heading}
                </Typography>
                <Typography variant='h1' fontWeight={700}>
                    {details.title || details.name}
                </Typography>
                <Typography className='FeaturedHero__overview' variant='body1'>
                    {details.overview}
                </Typography>
                <Typography variant='body2'>
                    {new Date(details.release_date || details.first_air_date).getFullYear()} •{' '}
                    {details.genre_ids.map((genreId) => genreMap[genreId].name).join(', ')}
                </Typography>
                <Box className='FeaturedHero__cta'>
                    <Button
                        variant='contained'
                        endIcon={<ChevronRightIcon />}
                        LinkComponent={Link}
                        to={`/on-demand/${
                            details.hasOwnProperty('release_date') ? 'movie' : 'series'
                        }/${details.id}`}
                    >
                        Watch now
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
};

export default FeaturedHero;
