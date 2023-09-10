import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import FeaturedHero from '../FeaturedHero/FeaturedHero';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Featured.scss';

const Featured = () => {
    const featured = useSelector((state) => state.explore.featured);

    return (
        <Box className='Featured' component='section'>
            {featured.length && (
                <Carousel
                    showThumbs={false}
                    showStatus={false}
                    showArrows={false}
                    transitionTime={1000}
                    interval={8000}
                    infiniteLoop
                    stopOnHover
                    autoPlay
                >
                    {featured.map(({ heading, details }, i) => (
                        <FeaturedHero heading={heading} details={details} key={`slide-${i}`} />
                    ))}
                </Carousel>
            )}
        </Box>
    );
};

export default Featured;
