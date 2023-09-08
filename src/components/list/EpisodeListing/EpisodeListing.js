import { Paper, Skeleton, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import './EpisodeListing.scss';

const EpisodeListing = ({ episode, fallbackPoster, link }) => {
    const unreleased = !episode?.air_date || new Date() < new Date(episode?.air_date);

    return (
        <Stack
            className={`EpisodeListing ${unreleased ? 'EpisodeListing--disabled' : ''}`}
            spacing={0.25}
        >
            <Link to={link}>
                <Paper className='EpisodeListing__still' elevation={5}>
                    {episode ? (
                        <img
                            src={
                                episode.still_path
                                    ? `https://image.tmdb.org/t/p/w300${episode.still_path}`
                                    : `https://image.tmdb.org/t/p/w300${fallbackPoster}`
                            }
                            width={300}
                            height={169}
                            loading='lazy'
                        />
                    ) : (
                        <Skeleton variant='rounded' width={300} height={169} />
                    )}
                </Paper>
            </Link>
            <Typography variant='caption' color='text.secondary' fontWeight={400}>
                {episode ? `Episode ${episode.episode_number}` : <Skeleton width={100} />}
            </Typography>
            <Typography variant='body2' fontWeight={700} noWrap>
                {episode ? episode.name : <Skeleton width={200} />}
            </Typography>
            <Typography variant='caption' color='text.secondary' fontWeight={400} noWrap>
                {episode ? episode.overview : <Skeleton />}
            </Typography>
            <Typography variant='caption' fontWeight={400}>
                {episode ? (
                    episode.air_date ? (
                        new Date(episode.air_date).toLocaleDateString()
                    ) : (
                        'NA'
                    )
                ) : (
                    <Skeleton width={75} />
                )}
            </Typography>
        </Stack>
    );
};

export default EpisodeListing;
