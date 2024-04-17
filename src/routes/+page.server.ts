import * as db from '$lib/server/db';
import type { PageServerLoad, Actions } from './$types';
import { getDateWithWeekOffset, getLastMondayFromDate, getNextSundayFromDate } from '$lib/util';

export const load: PageServerLoad = async ({ params, url }) => {

    const weekoffset = Number(url.searchParams.get('week'));
    
    const offsetWeekDate = getDateWithWeekOffset(weekoffset);

    const lastMondayFromOffset = getLastMondayFromDate(offsetWeekDate).toISOString().split('T')[0];
    const nextSundayFromOffset = getNextSundayFromDate(offsetWeekDate).toISOString().split('T')[0];

    // console.log(weekoffset);
    // console.log(offsetWeekDate.toISOString().split('T')[0]);
    // console.log(lastMondayFromOffset);
    // console.log(nextSundayFromOffset);

    const data = {
        weekoffset,
        monday: getLastMondayFromDate(offsetWeekDate),
        gym: await db.select("gym", lastMondayFromOffset, nextSundayFromOffset),
        run: await db.select("run", lastMondayFromOffset, nextSundayFromOffset),
        core: await db.select("core", lastMondayFromOffset, nextSundayFromOffset),
        creatine: await db.select("creatine", lastMondayFromOffset, nextSundayFromOffset),
    };

    // console.log(data);

    return data;
};
