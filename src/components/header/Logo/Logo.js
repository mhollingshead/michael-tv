import logo from '../../../assets/logos/logo.svg';
import './Logo.scss';

const Logo = ({ height }) => {
    // The logo gets its own component Because the blur and script cause the dimensions of the svg to be 
    // much larger than its bounding box should be. To work around this, it needs to be put in a container 
    // that takes the proper dimensions while still allowing any overflow to be visible.

    // To make things easier, all calculations are generated using the supplied height of the logo, that way
    // it can be used throughout the project with the correct styling regardless of size.

    return (
        <div
            className='Logo'
            style={{
                height: `${height * 16}px`,
                width: `calc(${height * 16}px * 3)`
            }}
        >
            <img
                className='Logo__image'
                src={logo}
                alt='Michael TV'
                style={{
                    width: `calc(${height * 16}px * 3.5)`,
                    transform: `translateX(calc(${height * 16}px * -0.5)) 
                        translateY(calc(${height * 16}px * -0.9))`
                }}
            />
            <span className='Logo__glyph'>Michael TV</span>
        </div>
    );
};

export default Logo;
