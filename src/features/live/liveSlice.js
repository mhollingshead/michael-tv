import { createSlice } from '@reduxjs/toolkit';
import { getProgramming } from '../../common/fetchers/liveFetchers';
import { getLiveEvent, shouldUpdateProgramming } from '../../common/utils/liveUtils';
import { getActiveEvent, storeActiveEvent } from '../../common/utils/storageUtils';
import { cleanQuery } from '../../common/utils/miscUtils';
import channelMap from '../../common/data/channels.json';

const defaultChannelFilter = Object.keys(channelMap).map(() => true);
const defaultActiveChannel = getActiveEvent()?.activeChannel || 0;

const initialState = {
    programming: {
        channels: [],
        slots: [],
        canUpdate: true
    },
    guide: {
        channelFilter: defaultChannelFilter,
        activeChannel: defaultActiveChannel,
        activeEvent: 0
    }
};

const liveSlice = createSlice({
    name: 'live',
    initialState,
    reducers: {
        updateProgramming: (state, action) => {
            console.log('Updating programming');
            // Update channels and slots
            state.programming = action.payload;
            // Update the guide's active event to be the active channel's live event
            // This avoids situations where active events no longer exist after a programming update
            const activeChannel = action.payload.channels[state.guide.activeChannel] || action.payload.channels[0];
            state.guide.activeEvent = getLiveEvent(activeChannel, true);
        },
        updateCanUpdate: (state, action) => {
            state.programming.canUpdate = action.payload;
        },
        updateChannelFilter: (state, action) => {
            const { channels, query } = action.payload;
            // If the filter query is empty
            if (!query) {
                // Return to default channel filter
                state.guide.channelFilter = defaultChannelFilter;
            } else {
                // Otherwise, filter out channels whose names and call signs do not contain the query
                state.guide.channelFilter = channels.map(
                    (channel) =>
                        cleanQuery(channel.name).includes(cleanQuery(query)) ||
                        cleanQuery(channel.callSign).includes(cleanQuery(query))
                );
            }
        },
        updateActiveEvent: (state, action) => {
            // Save the active event in local storage
            storeActiveEvent(action.payload);
            // Update the active channel and active event
            state.guide.activeChannel = action.payload.activeChannel;
            state.guide.activeEvent = action.payload.activeEvent;
        }
    }
});

export const { updateProgramming, updateCanUpdate, updateChannelFilter, updateActiveEvent } =
    liveSlice.actions;

export const attemptProgrammingUpdate = () => async (dispatch, getState) => {
    // Extract the slots from state
    const {
        live: {
            programming: { slots, canUpdate }
        }
    } = getState();
    // Only request programming data if the stored slots are out of date
    if (shouldUpdateProgramming(slots) && canUpdate) {
        // Set canUpdate to false to avoid parallel requests
        dispatch(updateCanUpdate(false));
        try {
            // Wait until we receive live programming
            const programming = await getProgramming();
            // Update state
            dispatch(updateProgramming({ ...programming, canUpdate: true }));
        } catch (e) {
            // If error thrown, try again in 10 seconds
            setTimeout(() => dispatch(updateCanUpdate(true)), 10000);
        }
    }
};

export const filterChannels = (query) => (dispatch, getState) => {
    // Extract the channels from state
    const {
        live: {
            programming: { channels }
        }
    } = getState();
    // Update the channel filter
    dispatch(updateChannelFilter({ channels, query }));
};

export default liveSlice.reducer;
