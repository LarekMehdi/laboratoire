export abstract class UtilDate {

    // parse une string d'heure en dateTime (jour arbitraire)
    static parseStringToTime(sTime: string): Date {
        const [hour, minute] = sTime.split(":").map(Number);
        const date = new Date();
        date.setHours(hour, minute, 0, 0);

        return date;
    }

    // ajoute un nombre de minutes à une date donnée
    static addMinutes(date: Date, minutes: number): Date {
        return new Date(date.getTime() + minutes * 60000);
    }

    // calcul l'écart en minute entre 2 dates
    static getMinuteDifference(date1: Date, date2: Date): number {
        const diffMs = Math.abs(date1.getTime() - date2.getTime());
        return Math.round(diffMs / 60000);
    }
}