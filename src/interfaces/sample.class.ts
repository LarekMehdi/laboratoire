import { PRIORITY } from "../constantes/priority.constante";
import { SAMPLE_TYPE } from "../constantes/sample-type.constante";

export class Sample {

    id:             string;
    type:           SAMPLE_TYPE;
    priority:       PRIORITY;
    analysisTime:   number;
    arrivalTime:    string;
    patientId:      string;


    constructor(id: string, type: SAMPLE_TYPE, priority: PRIORITY, analysisTime: number, arrivalTime: string, patientId: string) {
        this.id = id;
        this.type = type;
        this.priority = priority;
        this.analysisTime = analysisTime;
        this.arrivalTime = arrivalTime;
        this.patientId = patientId;
    }
}