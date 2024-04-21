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