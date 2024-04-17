import { json } from '@sveltejs/kit';
import * as db from '$lib/server/db';

export async function POST() {
    db.createTable();
    return json({ message: 'Table created' });
}