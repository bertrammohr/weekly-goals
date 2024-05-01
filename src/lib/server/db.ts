import { sql } from "@vercel/postgres";
import { uuid } from 'uuidv4';

import type { AchievedGoal } from '$lib/scheme';

export const select = async (table: string, lastMondayFromOffset: string, nextSundayFromOffset: string) => {
    // console.log("select", table, lastMondayFromOffset, nextSundayFromOffset);
    if (table != 'gym' && table != 'run' && table != 'core' && table != 'creatine') { return Promise.reject('Invalid table'); }
    
    return new Promise<AchievedGoal[]>(async (resolve, reject) => {
        try {
            // const rows = [{id: '1', done_date: new Date('2021-09-01')}, {id: '2', done_date: new Date('2021-09-02')}, {id: '3', done_date: new Date('2021-09-03')}];
            let result;
            switch (table) {
                case 'gym':
                    result = await sql`SELECT * FROM gym WHERE done_date BETWEEN ${lastMondayFromOffset} AND ${nextSundayFromOffset};`;
                    break;
                case 'run':
                    result = await sql`SELECT * FROM run WHERE done_date BETWEEN ${lastMondayFromOffset} AND ${nextSundayFromOffset};`;
                    break;
                case 'core':
                    result = await sql`SELECT * FROM core WHERE done_date BETWEEN ${lastMondayFromOffset} AND ${nextSundayFromOffset};`;
                    break;
                case 'creatine':
                    result = await sql`SELECT * FROM creatine WHERE done_date BETWEEN ${lastMondayFromOffset} AND ${nextSundayFromOffset};`;
                    break;
            }
            const { rows } = result;

            resolve(rows.map((row) => {
                return {
                    id: row.id,
                    date: row.done_date,
                    type: table,
                };
            }));
        } catch (err) {
            reject(err);
        }

    });
}

export const selectAll = async () => {
    const { rows } = await sql`SELECT * FROM achieved_goals;`;
    return rows;
};

export const addGoal = async (goal: string, submitDate: string) => {
    // console.log("addGoal", goal, submitDate);
    return new Promise<string>(async (resolve, reject) => {
        const id = uuid();
        if (goal != 'gym' && goal != 'run' && goal != 'core' && goal != 'creatine') { return Promise.reject('Invalid goal'); }
        
        try {
            sql`INSERT INTO achieved_goals (id, done_date, goal_type) VALUES (${id}, ${submitDate}, ${goal});`;
            
            resolve(id);
        } catch (err) {
            reject(err);
        }
    });
}

export const removeGoal = async (goal: string, submitDate: string) => {
    // console.log("removeGoal", goal, submitDate);
    return new Promise<string>(async (resolve, reject) => {
        if (goal != 'gym' && goal != 'run' && goal != 'core' && goal != 'creatine') { return Promise.reject('Invalid goal'); }

        try {
            switch(goal) {
                case 'gym':
                    await sql`DELETE FROM gym WHERE done_date = ${submitDate};`
                    break;
                case 'run':
                    await sql`DELETE FROM run WHERE done_date = ${submitDate};`
                    break;
                case 'core':
                    await sql`DELETE FROM core WHERE done_date = ${submitDate};`
                    break;
                case 'creatine':
                    await sql`DELETE FROM creatine WHERE done_date = ${submitDate};`
                    break;
            }
            resolve(submitDate);
        } catch (err) {
            reject(err);
        }
    });
}
export const fixDatabase = async () => {
    const { rows: gymrows } = await sql`SELECT * FROM gym;`;
    const { rows: runrows } = await sql`SELECT * FROM run;`;
    const { rows: corerows } = await sql`SELECT * FROM core;`;
    const { rows: creatinerows } = await sql`SELECT * FROM creatine;`;

    [...gymrows, ...runrows, ...corerows, ...creatinerows].forEach((row) => {
        sql`INSERT INTO achieved_goals (id, done_date, goal_type) VALUES (${row.id}, ${row.done_date}, ${row.goal_type});`
    });
}