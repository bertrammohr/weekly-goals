import { json } from '@sveltejs/kit';
import * as db from '$lib/server/db';

export async function DELETE(event) {
    try {
        const data = await event.request.json();
        if (!data.type || !data.date) {
            return json({message: "error"});
        }
        const id = await db.removeGoal(data.type, data.date);
        return json({message: "success", id});
    } catch(err) {
        console.error(err);
        return json({message: "error"});
    }
}