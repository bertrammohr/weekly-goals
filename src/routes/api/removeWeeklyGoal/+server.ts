import { json } from '@sveltejs/kit';
import * as db from '$lib/server/db';
import { verifyPassword } from '$lib/util';

export async function DELETE(event) {
    try {
        const password = event.request.headers.get("Authorization")?.split(" ")[1];

        if (!password || ! await verifyPassword(password)) {
            return json({message: "error"});
        }

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