import genreMap from '../../common/data/genres.json';

export const cleanQuery = (str) => {
    return str.toLowerCase().replace(/ /g, '');
};

export const formatTime = (date) => {
    return new Date(date).toTimeString().slice(0, 5);
};

export const formatTimeRange = (date1, date2) => {
    const startTime = formatTime(date1);
    const endTime = formatTime(date2);
    return `${startTime}-${endTime}`;
};

export const formatYearRange = (date1, date2) => {
    return `${date1.slice(0, 4)}-${date2.slice(0, 4)}`;
};

export const formatEpisodeInfo = (program) => {
    return program.season || program.episode || program.episodeTitle ? (
        <>
            {program.season && `S${program.season}`}
            {program.season && program.episode && ' '}
            {program.episode && `E${program.episode}`}
            {(program.season || program.episode) && program.episodeTitle && ' • '}
            {program.episodeTitle || ''}
        </>
    ) : null;
};

export const formatTitleInfo = (title) => {
    return (
        <>
            {title.first_air_date?.slice(0, 4) || title.release_date?.slice(0, 4) || ''}
            {(title.first_air_date || title.release_date) && title.genre_ids[0] && ' • '}
            {title.genre_ids[0] && genreMap[title.genre_ids[0]].name}
        </>
    );
};

export const getColorByBrightness = (colors, theme) => {
    // Calculate brightness of RGB color
    const calculateBrightness = (rgb) => {
        return 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
    };

    // Convert hex colors to RGB and calculate brightness
    const colorsWithBrightness = colors.map((rgb) => {
        const brightness = calculateBrightness(rgb);
        return { rgb, brightness };
    });

    // Sort colors by brightness
    colorsWithBrightness.sort((a, b) => a.brightness - b.brightness);

    if (theme === 'dark') {
        const [r, g, b] = colorsWithBrightness[0].rgb;
        return `rgb(${r},${g},${b})`;
    } else if (theme === 'light') {
        const [r, g, b] = colorsWithBrightness[colorsWithBrightness.length - 1].rgb;
        return `rgb(${r},${g},${b})`;
    }
};

export const getEventStyles = (event, isLast) => {
    return {
        width: `calc(${event.width}% - ${isLast ? 0 : 4}px)`,
        maxWidth: `calc(${event.width}% - ${isLast ? 0 : 4}px)`
    };
};

export const getFeaturedHeroStyles = (colors, mode, details) => {
    return {
        backgroundImage: `url("https://image.tmdb.org/t/p/w1280${details.backdrop_path}")`,
        '::before': {
            background: `linear-gradient(
                to right, 
                ${getColorByBrightness(colors, mode)}, 
                transparent 100%
            )`
        },
        '::after': {
            background: `linear-gradient(
                to top,
                var(--palette-background-default),
                transparent ${mode === 'dark' ? '100' : '75'}%
            ), linear-gradient(
                to top, 
                ${getColorByBrightness(colors, mode)} 16%, 
                transparent 100%
            )`
        }
    };
};
