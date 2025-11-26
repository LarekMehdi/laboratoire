import { Equipment } from "../classes/equipment.class";
import { Sample } from "../classes/sample.class";
import { ScheduleEntry } from "../classes/schedule-entry.class";
import { Technician } from "../classes/technician.class";
import { ScheduleSlot } from "../interfaces/schedule-slot.interface";

export abstract class UtilEntity {

    // SCHEDULE ENTRY

    static createScheduleEntry(sample: Sample, tech: Technician, eq: Equipment, slot: ScheduleSlot): ScheduleEntry {
        return new ScheduleEntry(sample.id, tech.id, eq.id, slot.start, slot.end, sample.priority);
    }
}