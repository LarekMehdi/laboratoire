export class NoSlotError extends Error {
    arrivalTime: Date;
    duration: number;

    constructor(arrivalTime: Date, duration: number, message?: string) {
        super(`No available slot for a sample arriving at ${arrivalTime.toISOString()} with duration ${duration} minutes. ${message ? message : ''}`);
        this.name = "NoSlotError";
        this.arrivalTime = arrivalTime;
        this.duration = duration;

        Object.setPrototypeOf(this, NoSlotError.prototype);
    }
}