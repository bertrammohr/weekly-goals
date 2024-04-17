import { json } from '@sveltejs/kit';
import * as db from '$lib/server/db';

export async function POST(event) {
    try {
        const data = await event.request.json();
        if (!data.type || !data.submitDate) {
            return json({message: "error"});
        }
        const id = await db.addGoal(data.type, data.submitDate);
        return json({message: "success", id});
    } catch(err) {
        console.error(err);
        return json({message: "error"});
    }
}