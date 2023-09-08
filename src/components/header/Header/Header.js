import { NavLink, useLocation } from 'react-router-dom';
import { IconButton, Stack, Tab, Tabs, useColorScheme } from '@mui/material';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SearchIcon from '@mui/icons-material/Search';
import DvrIcon from '@mui/icons-material/Dvr';
import Logo from '../Logo';
import './Header.scss';

const Header = ({ handleModeChange }) => {
    const location = useLocation();
    const { mode } = useColorScheme();

    return (
        <Stack
            className='Header'
            component='header'
            direction='row'
            alignItems='center'
            spacing={4}
        >
            <Logo height={1.75} />
            <Tabs value={location.pathname.split('/')[1]} textColor='inherit' component='nav'>
                <Tab
                    className='Header__link'
                    value='on-demand'
                    label='On Demand'
                    icon={<DvrIcon fontSize='small' />}
                    iconPosition='start'
                    component={NavLink}
                    to='/on-demand'
                />
                <Tab
                    className='Header__link'
                    value='live'
                    label='Live TV'
                    icon={<OndemandVideoIcon fontSize='small' />}
                    iconPosition='start'
                    component={NavLink}
                    to='/live'
                />
                <Tab
                    className='Header__link'
                    value='search'
                    label='Search'
                    icon={<SearchIcon fontSize='small' />}
                    iconPosition='start'
                    component={NavLink}
                    to='/search'
                />
            </Tabs>
            <IconButton
                aria-label='Toggle light/dark mode'
                color='primary'
                size='small'
                onClick={handleModeChange}
                sx={{ ml: 'auto !important' }}
            >
                {mode === 'dark' ? (
                    <LightModeIcon fontSize='small' />
                ) : (
                    <DarkModeIcon fontSize='small' />
                )}
            </IconButton>
        </Stack>
    );
};

export default Header;
