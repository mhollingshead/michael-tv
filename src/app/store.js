import { configureStore } from "@reduxjs/toolkit";
import liveReducer from '../features/live/liveSlice';
import searchReducer from '../features/search/searchSlice';
import exploreReducer from '../features/explore/exploreSlice';

export const store = configureStore({
    reducer: {
        live: liveReducer,
        search: searchReducer,
        explore: exploreReducer
    }
});