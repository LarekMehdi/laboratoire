import { SPECIALITY } from "../constantes/speciality.constante";

export class Technician {

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