import { Metric } from "../classes/metric.class";
import { ScheduleOutput } from "../interfaces/schedule-output.interface";

export class OutputData {
    
    constructor(public schedule: ScheduleOutput[], public metrics: Metric) {}
}