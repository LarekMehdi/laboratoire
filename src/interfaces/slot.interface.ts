import { Technician } from "../classes/technician.class";
import { ScheduleSlot } from "./schedule-slot.interface";

export interface SlotWithTechnicianList {
    slot: ScheduleSlot;
    technicianList: Technician[];
}