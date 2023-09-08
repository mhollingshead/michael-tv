import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    results: [],
    page: 1,
    totalPages: 0,
    options: {
        method: 'filter',
        args: []
    }
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchResults: (state, action) => {
            state.results = action.payload.results;
            state.page = action.payload.page;
            state.totalPages = action.payload.totalPages;
            state.options.method = action.payload.method;
            state.options.args = action.payload.args;
        },
        addSearchResults: (state, action) => {
            state.results.push(...action.payload.results);
            state.page = action.payload.page;
        }
    }
});

export const { setSearchResults, addSearchResults } = searchSlice.actions;
export default searchSlice.reducer;