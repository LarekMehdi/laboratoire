import { PRIORITY } from "../constantes/priority.constante";

export interface ScheduleOutput {

    sampleId: string;
    technicianId: string;
    equipmentId: string;
    startTime: string;
    endTime: string;
    priority: PRIORITY;
}