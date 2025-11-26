export class Laboratory {

    name: string;
    openingHourStart: Date;
    openingHourEnd: Date;
    date: Date;

    constructor(name: string, openingHourStart: Date, openingHourEnd: Date, date: Date) {
        this.name = name;
        this.openingHourStart = openingHourStart;
        this.openingHourEnd = openingHourEnd;
        this.date = date;
    }
}