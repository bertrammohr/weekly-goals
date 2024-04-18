import { sql } from "@vercel/postgres";
import { uuid } from 'uuidv4';

import type { AchievedGoal } from '$lib/scheme';

export const select = async (table: string, lastMondayFromOffset: string, nextSundayFromOffset: string) => {
    if (table != 'gym' && table != 'run' && table != 'core' && table != 'creatine') { return Promise.reject('Invalid table'); }
    
    return new Promise<AchievedGoal[]>(async (resolve, reject) => {
        try {
            // const rows = [{id: '1', done_date: new Date('2021-09-01')}, {id: '2', done_date: new Date('2021-09-02')}, {id: '3', done_date: new Date('2021-09-03')}];
            const { rows } = await sql`SELECT * FROM gym WHERE done_date BETWEEN ${lastMondayFromOffset} AND ${nextSundayFromOffset};`;

            resolve(rows.map((row) => {
                return {
                    id: row.id,
                    date: row.done_date,
                };
            }));
        } catch (err) {
            reject(err);
        }

    });
}

export const addGoal = async (goal: string, submitDate: string) => {
    return new Promise<string>(async (resolve, reject) => {
        const id = uuid();
        if (goal != 'gym' && goal != 'run' && goal != 'core' && goal != 'creatine') { return Promise.reject('Invalid goal'); }

        try {
            await sql`INSERT INTO ${goal} (id, done_date) VALUES (${id}, ${submitDate});`
            resolve(id);
        } catch (err) {
            reject(err);
        }
    });
}

export const removeGoal = async (goal: string, submitDate: string) => {
    return new Promise<string>(async (resolve, reject) => {
        if (goal != 'gym' && goal != 'run' && goal != 'core' && goal != 'creatine') { return Promise.reject('Invalid goal'); }

        try {
            await sql`DELETE FROM ${goal} WHERE done_date = ${submitDate};`
            resolve(submitDate);
        } catch (err) {
            reject(err);
        }
    });
}