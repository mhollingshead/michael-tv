import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import ScrollableList from '../../list/ScrollableList';
import TitleListing from '../../list/TitleListing';
import { getRecommended } from '../../../common/fetchers/onDemandFetchers';
import './RecommendedTitles.scss';

const RecommendedTitles = ({ id, type }) => {
    const [results, setResults] = useState([]);

    useEffect(() => {
        getRecommended(id, type).then(setResults);
    }, [id, type]);

    return (
        results.length ? (
            <Box className='RecommendedTitles' component='section'>
                <Typography
                    className='RecommendedTitles__guttered-content'
                    variant='h4'
                    component='h2'
                    fontWeight={700}
                >
                    Recommended
                </Typography>
                <ScrollableList>
                    {results.map((result) => (
                        <TitleListing title={result} key={result.id} />
                    ))}
                </ScrollableList>
            </Box>
        ) : null
    );
};

export default RecommendedTitles;
