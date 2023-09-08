import axios from 'axios';
import { extractEventData, getNearestSlot, getSlots } from '../utils/liveUtils';
import allChannels from '../data/channels.json';

const BASE_URL = 'https://tvlistings.zap2it.com/api/grid';

export const getProgramming = () =>
    axios
        .get(
            BASE_URL +
                '?lineupId=DFLTE' +
                '&timespan=2' +
                '&headendId=DFLTE' +
                '&country=USA' +
                '&timezone=' +
                '&device=-' +
                '&postalCode=10001' +
                '&isOverride=true' +
                `&time=${parseInt(getNearestSlot() / 1000)}` +
                '&pref=16%2C128' +
                '&userId=-' +
                '&aid=gapzap' +
                '&languagecode=en-us'
        )
        .then(({ data: { channels } }) => {
            // Get the current slots
            const slots = getSlots();

            channels = channels
                // Filter out unneeded channels
                .filter((channel) => allChannels[channel.callSign])
                // Extract event data
                .map((channel) => ({
                    ...allChannels[channel.callSign],
                    events: extractEventData(channel.events, slots[0])
                }));

            // Return the channels and slots
            return { channels, slots };
        });
