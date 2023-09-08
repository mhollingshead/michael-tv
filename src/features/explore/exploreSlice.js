import { createSlice } from '@reduxjs/toolkit';
import { getExploreLists } from '../../common/utils/exploreUtils';

const initialState = {
    sections: [],
    featured: []
}

const exploreSlice = createSlice({
    name: 'explore',
    initialState,
    reducers: {
        setExploreData: (state, action) => {
            state.featured = action.payload.featured;
            state.sections = action.payload.sections;
            console.log(action.payload);
        }
    }
});

export const { setExploreData } = exploreSlice.actions;

export const initializeExplore = () => async (dispatch) => {
    const exploreLists = await getExploreLists();
    dispatch(setExploreData(exploreLists));
};

export default exploreSlice.reducer;