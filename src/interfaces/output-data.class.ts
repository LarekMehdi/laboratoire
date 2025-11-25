import { Metric } from "./metric.class";
import { ScheduleEntry } from "./schedule-entry.class";

export class OutputData {
    
    constructor(public schedule: ScheduleEntry[], public metrics: Metric) {}
}