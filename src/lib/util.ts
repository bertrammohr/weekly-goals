export const getDateWithWeekOffset = (weekOffset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + (weekOffset * 7));
    return d;
}

export const getLastMondayFromDate = (a: Date) => {
    const d = new Date(a);
    const x = d.getDay() === 0 ? 6 : d.getDay() - 1;
    d.setDate(d.getDate() - x);
    return d;
}

export const getNextSundayFromDate = (a: Date) => {
    const d = new Date(a);
    const x = d.getDay() === 0 ? 6 : d.getDay() - 1;
    d.setDate(d.getDate() - x + 6);
    return d;
}

import bcrypt from "bcrypt";

export const verifyPassword = async (password: string) => {
    const hashedPassword = "$2b$10$ZH9LxAdZ9G/G2Sa52BFYm.w8IxgVmPuRz/2WGuQpnnKnfIvRewFNu";

    const valid = await bcrypt.compare(password, hashedPassword)

    return valid;
}