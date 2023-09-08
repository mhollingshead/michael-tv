<h1 align="center">
    <div>
        <img src="./public/favicon.png" width="40" align="top" />
        <span>Michael TV</span>
    </div>
</h1>

<p align="center">
    A mock streaming service built with
    <b><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="24" align="top" /> React</b>, <b><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" height="24" align="top" /> Redux</b>, and <b><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg" height="24" align="top" /> Material UI</b>.
</p>

<p align="center">
    <a href="#install-and-run-locally">Installation</a> • <a href="#features">Features</a> • <a href="#technologies">Technologies</a>
</p>

## Install and Run Locally

- Clone the repository by running `git clone https://github.com/mhollingshead/michael-tv.git` and `cd` into the project directory.
    - Alternatively, you can download and extract [`michael-tv-main.zip`](https://github.com/mhollingshead/michael-tv/archive/refs/heads/main.zip).
- Rename `.env.sample` to `.env` and set `REACT_APP_TMDB_API_KEY` to your [TMDB API key](https://developer.themoviedb.org/docs/getting-started).
    - The app relies heavily on the TMDB API, so **this step is required** for the app to work.
- Run `npm install` to install the necessary dependencies, then `npm start` to start the application.

## Features

### Explore

<img src="./public/assets/explore.png" alt="Explore Page" />

The explore page acts as the homepage of Michael TV and the landing page of the `/on-demand` route. It offers a rich set of features designed to enhance the content discovery experience:

- **Featured Titles**: The hero carousel that provides personalized recommendations.
    - A custom recommendation algorithm uses weighted randomness to combine user watch histories/durations with trending, popular, and recent releases to curate a diverse yet relevant selection of titles.
    - *For a more in-depth explanaton of the recommendation algorithm, see the detailed write-up in [exploreUtils.js](./src/common/utils/exploreUtils.js)*
- **Continue Watching**: A list of titles that the user is currently watching, allowing them to pick up where they left off.
- **Trending, Recently Released, and Popular Titles**
- **Because You Watched...**: Lists of recommendations based on user watch histories.
    - These lists are also curated by the recommendation algorithm, ensuring a continuously relevant and varied selection.

#### Performance Optimization

To optimize performance, all title lists are virtualized using [react-render-if-visible](https://www.npmjs.com/package/react-render-if-visible) and all title posters are lazy loaded. This ensures load times are fast and image data is only transfered when absolutely necessary.

Additionally, the explore page lists (which are built using the TMDB API) are only fetched once during the initial app load. This minimizes burdensome bulk API requests and helps stay compliant with rate limits.

### Live TV

<img src="./public/assets/live-tv.png" alt="Live TV" />

The live TV page `/live` is home to Michael TV's live television. It offers a range of features designed to provide users with a seamless and interactive live TV experience:

- **Guide**: The real-time TV guide displays programming schedules for ~80 popular television channels.
    - The app polls at 1 second intervals to ensure the programming is up to date and the guide updates in real time.
    - All programming is stored in global state using Redux, enabling live TV data to be accessible to other parts of the app.
- **Program Information**: Users can select any event in the programming grid to access more comprehensive details, including ratings, duration, overviews, and episode information.
    - Relevant event programs are linked to their [on-demand counterparts](#titles), allowing users to explore additional episodes or watch content at their convenience.

#### Performance Optimization

To optimize performance, all guide rows are virtualized using [react-window](https://www.npmjs.com/package/react-window) to maintain fast load times and seemless transitions between pages.

Additionally, polling to check for outdated programming data at the application level ensures the API is only called when necessary (typically once every 30 minutes), minimizing unnecessary API calls and contributing to efficient resource usage.

### Titles

<img src="./public/assets/title.png" alt="Title Page" />

Title pages `/on-demand/:type/:id` serve as landing pages for series and movies. Here, users can access comprehensive details about the title, explore related content, browse seasons and episodes (if applicable), and initiate playback. These pages offer a range of features that enhance the user's viewing experience:

- **Live Banner**: If the title is currently airing on a live TV channel, a live banner is displayed, containing relevant program information.
- **Title Hero**: A hero section that provides key information about the title.
    - Clicking the title's genre(s) redirects users to the search page with the relevant genre filters applied, allowing them to explore titles with the same collection of genres.
    - The play button uses the watch history saved in localStorage to automatically direct users to the next unwatched episode, ensuring uninterrupted viewing.
- **Episode List**: If the title is a series, the episode list allows users to browse all seasons and episodes.
- **Recommended Titles**: A list of titles deemed similar by the TMDB API.

#### Performance Optimization

All episode stills are lazy loaded, preventing unnecessary bulk image data transfers.

### Search

<img src="./public/assets/search.png" alt="Search" />

The search page `/search` allows users to search tv series, movies, or all titles using one of two methods:

- **Queries**: Users can search for titles by entering a query string, allowing for quick and straightforward searches, **or**
- **Filters**: Users can search for titles by applying filters such as genre, network, before year, and after year.

Due to the options available with the TMDB `/search` and `/discover` endpoints, filters and queries cannot be combined––they are **mutually exclusive**.

#### Performance Optimization

To ensure an efficient and responsive search experience, the search page automatically fetches results from the TMDB API whenever a change is made to the search form. To prevent unwanted simultaneous requests (e.g. scrolling over a number input), requests on text-based inputs are throttled, minimizing the potential of sending a high volume of requests per second and ensuring compliance with rate limits.

### Watch

Unfortunately, I wasn't able to get the streaming rights for every movie, series, and live tv channel (I didn't even try). For completion, there is a placeholder `/watch` page that just contains a never-ending progress wheel.

## Technologies

Michael TV uses:

- **[React](https://react.dev/)** for the application framework
- **[Redux](https://redux.js.org/)** for global state management
- **[Materual UI](https://mui.com/)** as a component library
- **[SASS](https://sass-lang.com/)** for additional styling
- **[React Router](https://reactrouter.com/en/main)** for routing
- **[Axios](https://axios-http.com/)** as an HTTP client
- **[react-render-if-visible](https://www.npmjs.com/package/react-render-if-visible)** and **[react-window](https://www.npmjs.com/package/react-window)** for virtualization
- **[image-palette](https://www.npmjs.com/package/image-palette)** for color palette extraction
- **[TMDB API](https://developer.themoviedb.org/docs)** for series/movie data and images