import { json } from '@sveltejs/kit';
import { verifyPassword } from '$lib/util';

export async function POST(event) {
    try {
        const data = await event.request.json();
        if (!data.code) {
            return json({message: "error#1"});
        }
        
        // validate password
        const valid = await verifyPassword(data.code);

        // for generating password
        // const salt = bcrypt.genSaltSync(10);
        // const hash = bcrypt.hashSync("plain text password", salt);

        return json({message: (valid ? "success" : "wrong password")});
    } catch(err) {
        console.error(err);
        return json({message: "error#3"});
    }
}