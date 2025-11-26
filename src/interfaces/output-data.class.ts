import { Metric } from "./metric.class";
import { ScheduleOutput } from "./schedule-output.interface";

export class OutputData {
    
    constructor(public schedule: ScheduleOutput[], public metrics: Metric) {}
}