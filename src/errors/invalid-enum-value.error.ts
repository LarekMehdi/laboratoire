export class InvalidEnumValueError extends Error {
    value: string;

    constructor(value: string, message?: string) {
        super(`Invalid enum value: ${value}. ${message ? message : ''}`);
        this.name = "InvalidEnumValueError";
        this.value = value;

        Object.setPrototypeOf(this, InvalidEnumValueError.prototype);
    }
}