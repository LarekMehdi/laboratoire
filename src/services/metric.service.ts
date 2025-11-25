import { ScheduleEntry } from "../interfaces/schedule-entry.class";
import { ScheduleSlot } from "../interfaces/schedule-slot.interface";
import { UtilDate } from "../utils/date.util";

export abstract class MetricService {

    static computeTotalTime(schedules: ScheduleEntry[]): number {
        if (schedules.length === 0) return 0;

        // regroupement des dates
        const startTimes: number[] = schedules.map(s => s.startTime.getTime());
        const endTimes: number[] = schedules.map(s => s.endTime.getTime());

        // le premier startTime et le dernier endTime
        const minStart = new Date(Math.min(...startTimes));
        const maxEnd = new Date(Math.max(...endTimes));

        return UtilDate.getMinuteDifference(minStart, maxEnd);
    }

    static computeEfficiency(occupiedSlotsByTechnicianId: Map<string, ScheduleSlot[]>, occupiedSlotsByEquipmentId: Map<string, ScheduleSlot[]>, totalTime: number): number {
        if (totalTime === 0) return 0;

        // on prends tous les slots
        const allSlots: ScheduleSlot[] = [...Array.from(occupiedSlotsByTechnicianId.values()).flat(), ...Array.from(occupiedSlotsByEquipmentId.values()).flat()];

        // si aucun créneaux occupé
        if (allSlots.length === 0) return 0;
        
        // temps ou les ressources sont occupées
        const totalActiveMinutes: number = allSlots.reduce((sum, slot) => sum + UtilDate.getMinuteDifference(slot.end, slot.start), 0);

        return (totalActiveMinutes / totalTime) * 100;
    }

    static computeConflicts() {

    }
}