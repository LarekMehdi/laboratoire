import { Sample } from "../interfaces/sample.class";
import { ScheduleEntry } from "../interfaces/schedule-entry.class";
import { ScheduleSlot, ScheduleSlotMillisecond } from "../interfaces/schedule-slot.interface";
import { UtilDate } from "../utils/date.util";
import { UtilNumber } from "../utils/number.util";

export abstract class MetricService {

    static computeTotalTime(samples: Sample[], schedules: ScheduleEntry[]): number {
        if (schedules.length === 0) return 0;
        const minArrival = Math.min(...samples.map(s => s.arrivalTime.getTime()));
        const maxEnd = Math.max(...schedules.map(s => s.endTime.getTime()));

        // TODO: methode util
        return (maxEnd - minArrival) / 60000;
    }

    static computeEfficiency(schedules: ScheduleEntry[], totalTime: number): number {
        if (schedules.length === 0 || totalTime === 0) return 0;

        // On additionne les durées des slots
        const totalActiveMinutes = schedules.reduce((sum, s) => {
            const start = s.startTime.getTime();
            const end = s.endTime.getTime();
            return sum + (end - start) / 60000;
        }, 0);

        // efficacité = charge totale / durée globale
        const rawEfficiency = (totalActiveMinutes / totalTime) * 100;

        return UtilNumber.roundOneDecimal(Math.min(rawEfficiency, 100));
    }

    static computeConflicts(occupiedSlotsByTechnicianId: Map<string, ScheduleSlot[]>, occupiedSlotsByEquipmentId: Map<string, ScheduleSlot[]>): number {
        let conflict = 0;

        const maps = [occupiedSlotsByTechnicianId, occupiedSlotsByEquipmentId];

        for (const occupiedSlotsByResourceId of maps) {
            for (const slots of occupiedSlotsByResourceId.values()) {

                // tris par startTime
                const sortedSlots = slots.slice().sort((a, b) => a.start.getTime() - b.start.getTime());

                for (let i = 0; i < sortedSlots.length - 1; i++) {
                    const current = sortedSlots[i];
                    const next = sortedSlots[i + 1];

                    // si se termine aprés le début de la suivante
                    if (current.end > next.start) {
                        conflict++;
                    }
                }
            }
        }

        return conflict;
    }
}