import { SPECIALITY } from "../constantes/speciality.constante";

export class Technician {

    id:         string;
    name:       string;
    speciality: SPECIALITY;
    startTime:  string;          // TODO: Date?
    endTime:    string;

    constructor(id: string, name: string, speciality: SPECIALITY, startTime: string, endTime: string) {
        this.id = id;
        this.name = name;
        this.speciality = speciality;
        this.startTime = startTime;
        this.endTime = endTime;
    }

}