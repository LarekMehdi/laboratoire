export abstract class UtilDate {

    static parseStringToTime(sTime: string) {
        const [hour, minute] = sTime.split(":").map(Number);
        const date = new Date();
        date.setHours(hour, minute, 0, 0);

        return date;
    }
}