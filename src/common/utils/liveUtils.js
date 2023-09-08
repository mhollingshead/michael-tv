export const getNearestSlot = () => {
    // Start with the current time
    const slot = new Date();
    // Round the current time down to the nearest 30 minute slot
    const minutes = slot.getMinutes();
    const roundedMinutes = Math.floor(minutes / 30) * 30;
    // Set the first slot's minutes to rounded minutes and remove any seconds or ms
    slot.setMinutes(roundedMinutes);
    slot.setSeconds(0);
    slot.setMilliseconds(0);
    // Return the slot
    return +slot;
};

export const getSlots = () => {
    // Get the first slot
    const firstSlot = getNearestSlot();
    // Determine how many slots will be displayed
    const slotCount = 4;
    // Create an array of 30 minute slots
    const slots = [];
    for (let i = 0; i < slotCount; i++) {
        // Start with the first slot
        const slot = new Date(firstSlot);
        // Add i * 30 minutes to the first slot
        slot.setMinutes(slot.getMinutes() + i * 30);
        // Push the new block to the slots array
        slots.push(+slot);
    }
    // Return the final block array
    return slots;
};

export const extractEventData = (events, slotStart) => {
    // Determine the number of slots that will be displayed
    const slotCount = 4;
    // Get the total minutes in the visible guide (each slot is 30 minutes)
    const totalMinutes = slotCount * 30;
    // Initialize an empty array of events
    const eventData = [];
    let remainingMinutes = totalMinutes;
    // For each event
    events.forEach((event) => {
        // If there's time remaining in the visible guide
        if (remainingMinutes > 0) {
            // Start with the event's original duration
            let duration = parseInt(event.duration);
            // Get the start time of the event
            const eventStart = new Date(event.startTime);
            // Trim the minutes that occur before the slot start
            if (eventStart < slotStart) duration -= (slotStart - eventStart) / 60000;
            // If the duration is larger than the remaining minutes, trim the excess minutes
            duration = Math.min(duration, remainingMinutes);
            // Push the event to the array with the updated duration and the percent
            eventData.push({
                startTime: +new Date(event.startTime),
                endTime: +new Date(event.endTime),
                type: event.filter.includes('filter-sports')
                    ? 'sports'
                    : event.filter.includes('filter-news')
                    ? 'news'
                    : event.filter.includes('filter-movie')
                    ? 'movie'
                    : event.program.title === 'SIGN OFF'
                    ? ''
                    : 'tv',
                flags: event.flag,
                tags: event.tags,
                rating: event.rating,
                width: (duration / totalMinutes) * 100,
                program: {
                    title: event.program.title,
                    episodeTitle: event.program.episodeTitle,
                    overview: event.program.shortDesc,
                    season: event.program.season,
                    episode: event.program.episode
                }
            });
            // Remove this program's duration from the remaining minutes
            remainingMinutes -= duration;
        }
    });
    // Return the event data
    return eventData;
};

export const eventIsLive = (event) => {
    // Get the current time
    const currentTime = new Date();
    // If current time falls within event's start and end times, return true
    return new Date(event.startTime) <= currentTime && currentTime < new Date(event.endTime);
};

export const getLiveEvent = (channel, asIndex) => {
    // Find the channel's live event
    const liveEvent = channel.events.find(eventIsLive);
    // Return either the event itself or the index of the event if asIndex is true
    return asIndex ? channel.events.indexOf(liveEvent) : liveEvent;
};

export const shouldUpdateProgramming = (slots) => {
    // If the first slot does not exist or is out of date, return true
    return !slots[0] || slots[0] !== getNearestSlot();
};
