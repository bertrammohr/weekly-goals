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

export const getDayStringFromNumber = (day: number) => {
    switch (day) {
        case 0:
            return "Søndag";
        case 1:
            return "Mandag";
        case 2:
            return "Tirsdag";
        case 3:
            return "Onsdag";
        case 4:
            return "Torsdag";
        case 5:
            return "Fredag";
        case 6:
            return "Lørdag";
    }
}

export const getDateStringFromWeekday = (base: Date, day: number) => {
    const newDate = new Date(base);
    newDate.setDate(newDate.getDate() + day - 1 + (day == 0 ? 7 : 0));

    return `${newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate()}/${newDate.getMonth() + 1 < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1}`
}