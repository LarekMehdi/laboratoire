import { SPECIALITY } from "../constantes/speciality.constante";
import { HasId } from "../interfaces/has-id.interface";

export class Technician implements HasId{

    id:         string;
    name?:      string;
    speciality: SPECIALITY[];
    startTime:  Date;          
    endTime:    Date;

    efficiency?: number;
    lunchBreak?: Date;

    constructor(id: string, speciality: SPECIALITY[], startTime: Date, endTime: Date,  name?: string) {
        this.id = id;
        this.name = name;
        this.speciality = speciality;
        this.startTime = startTime;
        this.endTime = endTime;
    }

}