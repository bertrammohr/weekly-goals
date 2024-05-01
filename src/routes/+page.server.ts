import * as db from '$lib/server/db';
import type { PageServerLoad, Actions } from './$types';
import { getDateWithWeekOffset, getLastMondayFromDate, getNextSundayFromDate } from '$lib/util';

export const load: PageServerLoad = async ({ params, url }) => {

    const weekoffset = Number(url.searchParams.get('week'));
    
    const offsetWeekDate = getDateWithWeekOffset(weekoffset);

    const lastMondayFromOffset = getLastMondayFromDate(offsetWeekDate);
    const nextSundayFromOffset = getNextSundayFromDate(offsetWeekDate);

    const mondayTime = (Math.floor((lastMondayFromOffset.getTime() / 86400000))*86400000)-(2*60*60*1000); 
    const sundayTime = Math.floor((nextSundayFromOffset.getTime() / 86400000))*86400000;

    const allWorkouts = (await db.selectAll()).map((workout) => {
        return {
            timestamp: new Date(workout.done_date).getTime(),
            id: workout.id,
            type: workout.goal_type,
            date: workout.done_date,
        }
    }).sort((a, b) => a.timestamp - b.timestamp);

    const workoutsForGivenWeek = allWorkouts.filter(w => mondayTime <= w.timestamp && w.timestamp <= sundayTime)
    
    const data = {
        weekoffset,
        allWorkouts,
        monday: lastMondayFromOffset,
        workouts: workoutsForGivenWeek,
    };

    // console.log(data);

    return data;
};
