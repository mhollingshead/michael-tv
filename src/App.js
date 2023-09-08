import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import {
    experimental_extendTheme as extendTheme,
    Experimental_CssVarsProvider as CssVarsProvider,
    CssBaseline
} from '@mui/material';
import Root from './routes/Root';
import Live from './routes/Live';
import Search from './routes/Search';
import Explore from './routes/Explore';
import Series, { loader as seriesLoader } from './routes/Series/Series';
import Movie, { loader as movieLoader } from './routes/Movie/Movie';
import Watch, { loader as watchLoader } from './routes/Watch/Watch';
import { attemptProgrammingUpdate } from './features/live/liveSlice';
import { initializeExplore } from './features/explore/exploreSlice';
import themeOptions from './common/data/themeOptions.json';

const theme = extendTheme(themeOptions);

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: 'on-demand',
                element: <Explore />
            },
            {
                path: 'on-demand/series/:id',
                loader: seriesLoader,
                element: <Series />
            },
            {
                path: 'on-demand/movie/:id',
                loader: movieLoader,
                element: <Movie />
            },
            {
                path: 'live',
                element: <Live />
            },
            {
                path: 'search',
                element: <Search />
            }
        ]
    },
    {
        path: '/watch/:type/:id/:season/:episode',
        loader: watchLoader,
        element: <Watch />
    },
    {
        path: '/watch/:type/:id',
        loader: watchLoader,
        element: <Watch />
    }
]);

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Populate live programming data
        dispatch(attemptProgrammingUpdate());
        // Populate explore data
        dispatch(initializeExplore());
        // Attempt live programming update each second
        const interval = setInterval(() => dispatch(attemptProgrammingUpdate()), 1000);
        return () => clearInterval(interval);
    });

    return (
        <CssVarsProvider theme={theme} defaultMode='dark'>
            <CssBaseline />
            <RouterProvider router={router} />
        </CssVarsProvider>
    );
};

export default App;
