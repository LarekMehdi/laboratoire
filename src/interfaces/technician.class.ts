import { SPECIALITY } from "../constantes/speciality.constante";
import { HasId } from "./has-id.class";

export class Technician implements HasId{

    id:         string;
    name:       string;
    speciality: SPECIALITY;
    startTime:  Date;          
    endTime:    Date;

    constructor(id: string, name: string, speciality: SPECIALITY, startTime: Date, endTime: Date) {
        this.id = id;
        this.name = name;
        this.speciality = speciality;
        this.startTime = startTime;
        this.endTime = endTime;
    }

}