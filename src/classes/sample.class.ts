import { PRIORITY } from "../constantes/priority.constante";
import { SAMPLE_TYPE } from "../constantes/sample-type.constante";
import { HasId } from "../interfaces/has-id.interface";

export class Sample implements HasId{

    id:             string;
    type:           SAMPLE_TYPE;
    priority:       PRIORITY;
    analysisTime:   number;
    arrivalTime:    Date;
    patientId:      string;


    constructor(id: string, type: SAMPLE_TYPE, priority: PRIORITY, analysisTime: number, arrivalTime: Date, patientId: string) {
        this.id = id;
        this.type = type;
        this.priority = priority;
        this.analysisTime = analysisTime;
        this.arrivalTime = arrivalTime;
        this.patientId = patientId;
    }
}