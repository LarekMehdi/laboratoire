import { PRIORITY } from "../constantes/priority.constante";

export class Constraint {

    maxProcessingTime: number;
    priorityRules: PRIORITY[];
    contaminationPrevention: boolean;
    parallelProcessing: boolean;

    constructor(maxProcessingTime: number, priorityRules: PRIORITY[], contaminationPrevention: boolean, parallelProcessing: boolean) {
        this.maxProcessingTime = maxProcessingTime;
        this.priorityRules = priorityRules;
        this.contaminationPrevention = contaminationPrevention;
        this.parallelProcessing = parallelProcessing;
    }

}