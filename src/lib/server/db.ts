import mysql from 'mysql2';
import { uuid } from 'uuidv4';
import type { ConnectionOptions, RowDataPacket } from 'mysql2';
import type { AchievedGoal } from '$lib/scheme';
import type { StringifyOptions } from 'querystring';

const access: ConnectionOptions = {
    user: 'root',
    database: 'weekly_goals',
};

const conn = mysql.createConnection(access);

export const select = async (table: string, lastMondayFromOffset: string, nextSundayFromOffset: string) => {
    if (table != 'gym' && table != 'run' && table != 'core' && table != 'creatine') { return Promise.reject('Invalid table'); }
    
    return new Promise<AchievedGoal[]>((resolve, reject) => {
        conn.query<RowDataPacket[]>(`SELECT * FROM ${table} WHERE done_date BETWEEN ? AND ?;`, [lastMondayFromOffset, nextSundayFromOffset], (_err, rows) => {
            if (_err) {
                return reject(_err);
            };
            resolve(rows.map((row) => {
                return {
                    id: row.id,
                    date: row.done_date,
                };
            }));
        });
    });
}

export const addGoal = async (goal: string, submitDate: string) => {
    return new Promise<string>((resolve, reject) => {
        const id = uuid();
        if (goal != 'gym' && goal != 'run' && goal != 'core' && goal != 'creatine') { return Promise.reject('Invalid goal'); }

        conn.query(`INSERT INTO ${goal} (id, done_date) VALUES (?, ?);`, [id, submitDate], (_err) => {
            if (_err) {
                return reject(_err);
            };
            resolve(id);
        });
    });
}

export const removeGoal = async (goal: string, submitDate: string) => {
    return new Promise<string>((resolve, reject) => {
        if (goal != 'gym' && goal != 'run' && goal != 'core' && goal != 'creatine') { return Promise.reject('Invalid goal'); }

        conn.query(`DELETE FROM ${goal} WHERE done_date = ?;`, [submitDate], (_err) => {
            if (_err) {
                return reject(_err);
            };
            resolve(submitDate);
        });
    });
}