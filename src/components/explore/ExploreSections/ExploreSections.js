import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import RenderIfVisible from 'react-render-if-visible';
import ScrollableList from '../../list/ScrollableList/ScrollableList';
import TitleListing from '../../list/TitleListing/TitleListing';
import './ExploreSections.scss';

const ExploreSections = () => {
    const sections = useSelector((state) => state.explore.sections);

    return (
        <Box className='ExploreSections'>
            {sections.map(({ heading, list, sections }, i) =>
                list ? (
                    <Box
                        className='ExploreSections__section'
                        component='section'
                        key={`section-${i}`}
                    >
                        <Typography
                            className='ExploreSections__guttered-content'
                            variant='h5'
                            component='h3'
                            fontWeight={700}
                        >
                            {heading}
                        </Typography>
                        <RenderIfVisible defaultHeight={313} visibleOffset={500}>
                            <ScrollableList>
                                {list.map((title, j) => (
                                    <TitleListing title={title} key={`section-${i}_title-${j}`} />
                                ))}
                            </ScrollableList>
                        </RenderIfVisible>
                    </Box>
                ) : (
                    <Box
                        className='ExploreSections__section'
                        component='section'
                        key={`section-${i}`}
                    >
                        <Typography
                            className='ExploreSections__guttered-content'
                            variant='h5'
                            component='h3'
                            fontWeight={700}
                        >
                            {heading}
                        </Typography>
                        {sections.map(({ heading, list }, j) => (
                            <Box className='ExploreSections__subsection' key={`section-${i}-${j}`}>
                                <Typography
                                    className='ExploreSections__guttered-content'
                                    component='h4'
                                    variant='body2'
                                    sx={{
                                        textTransform: 'uppercase',
                                        letterSpacing: '2px'
                                    }}
                                >
                                    {heading}
                                </Typography>
                                <RenderIfVisible defaultHeight={281} visibleOffset={500}>
                                    <ScrollableList>
                                        {list.map((title, k) => (
                                            <TitleListing
                                                title={title}
                                                key={`section-${i}-${j}_title-${k}`}
                                            />
                                        ))}
                                    </ScrollableList>
                                </RenderIfVisible>
                            </Box>
                        ))}
                    </Box>
                )
            )}
        </Box>
    );
};

export default ExploreSections;
