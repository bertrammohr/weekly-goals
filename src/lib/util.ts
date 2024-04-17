export const getDateWithWeekOffset = (weekOffset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + (weekOffset * 7));
    return d;
}

export const getLastMondayFromDate = (a: Date) => {
    const d = new Date(a);
    d.setDate(d.getDate() - d.getDay() + 1);
    return d;
}

export const getNextSundayFromDate = (a: Date) => {
    const d = new Date(a);
    d.setDate(d.getDate() + (7 - d.getDay()));
    return d;
}