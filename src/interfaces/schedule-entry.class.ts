import { PRIORITY } from "../constantes/priority.constante";

export class ScheduleEntry {

    sampleId: string;
    technicianId: string;
    equipmentId: string;
    startTime: Date;
    endTime: Date;
    priority: PRIORITY;

    constructor(sampleId: string, technicianId: string, equipmentId: string, startTime: Date, endTime: Date, priority: PRIORITY) {
        this.sampleId = sampleId;
        this.technicianId = technicianId;
        this.equipmentId = equipmentId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.priority = priority;
    }
}