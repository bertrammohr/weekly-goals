import * as db from '$lib/server/db';
import type { PageServerLoad, Actions } from './$types';
import { getDateWithWeekOffset, getLastMondayFromDate, getNextSundayFromDate } from '$lib/util';

export const load: PageServerLoad = async ({ params, url }) => {

    const weekoffset = Number(url.searchParams.get('week'));
    
    const offsetWeekDate = getDateWithWeekOffset(weekoffset);

    const lastMondayFromOffset = getLastMondayFromDate(offsetWeekDate);
    const lastMondayFromOffsetText = lastMondayFromOffset.toISOString().split('T')[0];
    const nextSundayFromOffset = getNextSundayFromDate(offsetWeekDate)
    const nextSundayFromOffsetText = nextSundayFromOffset.toISOString().split('T')[0];

    const mondayTime = Math.floor((lastMondayFromOffset.getTime() / 86400000))*86400000;
    const sundayTime = Math.floor((nextSundayFromOffset.getTime() / 86400000))*86400000;

    const allWorkouts = (await db.selectAll()).map((workout) => {
        return {
            timestamp: new Date(workout.done_date).getTime(),
            id: workout.id,
            type: workout.goal_type,
        }
    })

    const sortedWorkouts = allWorkouts.filter(w => mondayTime <= w.timestamp && w.timestamp <= sundayTime).sort((a, b) => a.timestamp - b.timestamp);

    console.log(mondayTime, sundayTime);

    console.table(allWorkouts);
    console.table(sortedWorkouts);

    const data = {
        weekoffset,
        monday: lastMondayFromOffset,
        workouts: [
            ...(await db.select("gym", lastMondayFromOffsetText, nextSundayFromOffsetText)),
            ...(await db.select("run", lastMondayFromOffsetText, nextSundayFromOffsetText)),
            ...(await db.select("core", lastMondayFromOffsetText, nextSundayFromOffsetText)),
            ...(await db.select("creatine", lastMondayFromOffsetText, nextSundayFromOffsetText)),
        ],
    };

    // console.log(data);

    return data;
};
