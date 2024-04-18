import { sql } from "@vercel/postgres";
import { uuid } from 'uuidv4';

import type { AchievedGoal } from '$lib/scheme';

// export const createTable = async () => {
//     await sql`CREATE TABLE \`gym\` (
//         \`id\` TEXT NOT NULL DEFAULT uuid() COLLATE 'utf8mb4_general_ci',
//         \`done_date\` TIMESTAMP NOT NULL DEFAULT current_timestamp()
//     )`
//     await sql`CREATE TABLE \`run\` (
//         \`id\` TEXT NOT NULL DEFAULT uuid() COLLATE 'utf8mb4_general_ci',
//         \`done_date\` TIMESTAMP NOT NULL DEFAULT current_timestamp()
//     )`
//     await sql`CREATE TABLE \`core\` (
//         \`id\` TEXT NOT NULL DEFAULT uuid() COLLATE 'utf8mb4_general_ci',
//         \`done_date\` TIMESTAMP NOT NULL DEFAULT current_timestamp()
//     )`
//     await sql`CREATE TABLE \`creatine\` (
//         \`id\` TEXT NOT NULL DEFAULT uuid() COLLATE 'utf8mb4_general_ci',
//         \`done_date\` TIMESTAMP NOT NULL DEFAULT current_timestamp()
//     )`
// };

export const select = async (table: string, lastMondayFromOffset: string, nextSundayFromOffset: string) => {
    console.log("select", table, lastMondayFromOffset, nextSundayFromOffset);
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
    console.log("addGoal", goal, submitDate);
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
    console.log("removeGoal", goal, submitDate);
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
