export class NoResourceError extends Error {
    start: Date;
    end: Date;

    constructor(start: Date, end: Date, message?: string) {
        super(`No resource available for slot ${start.toISOString()} - ${end.toISOString()}. ${ message ? message : ''}`);
        this.name = "NoResourceError";
        this.start = start;
        this.end = end;

        Object.setPrototypeOf(this, NoResourceError.prototype);
    }
}