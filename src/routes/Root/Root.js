import { useColorScheme } from '@mui/material';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Header from '../../components/header/Header';
import './Root.scss';

const Root = () => {
    const location = useLocation();
    const { mode, setMode } = useColorScheme();

    const handleModeChange = () => {
        setMode(mode === 'dark' ? 'light' : 'dark');
    }


    return location.pathname === '/' ? (
        // No homepage, so redirect to /on-demand if currently on root
        <Navigate to='/on-demand' replace />
    ) : (
        <>
            <Header handleModeChange={handleModeChange} />
            <Outlet />
        </>
    );
};

export default Root;
