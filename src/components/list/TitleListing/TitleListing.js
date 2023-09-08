import { Link } from 'react-router-dom';
import { Paper, Stack, Typography } from '@mui/material';
import { formatTitleInfo } from '../../../common/utils/miscUtils';
import defaultPoster from '../../../assets/images/poster.png';
import './TitleListing.scss';

const TitleListing = ({ title }) => {
    const type = title.hasOwnProperty('release_date') ? 'movie' : 'series';

    return (
        <Stack className='TitleListing' spacing={0.5}>
            <Link to={`/on-demand/${type}/${title.id}`}>
                <Paper className='TitleListing__poster' elevation={5}>
                    <img
                        src={
                            title.poster_path
                                ? `https://image.tmdb.org/t/p/w342${title.poster_path}`
                                : defaultPoster
                        }
                        width={154}
                        height={230}
                        loading='lazy'
                    />
                </Paper>
            </Link>
            <Typography variant='body2' fontWeight={700} noWrap>
                {title.name || title.title}
            </Typography>
            <Typography variant='caption' color='text.secondary' fontWeight={400}>
                {formatTitleInfo(title)}
            </Typography>
        </Stack>
    );
};

export default TitleListing;
