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

        return (maxEnd - minArrival) / 60000;
    }

    static computeEfficiency(schedules: ScheduleEntry[], totalTime: number): number {
        if (schedules.length === 0 || totalTime === 0) return 0;

        // récupérer tous les intervalles en milisecondes
        const intervals: ScheduleSlotMillisecond[] = schedules.map(s => ({ start: s.startTime.getTime(), end: s.endTime.getTime() }));
        
        // trier par startTime
        intervals.sort((a, b) => a.start - b.start);

        // fusionner les intervalles pour enlever les chevauchements
        const merged: ScheduleSlotMillisecond[] = [];
        for (const interval of intervals) {
            if (merged.length === 0) {
                merged.push({ ...interval });
            } else {
                const last = merged[merged.length - 1];
                if (interval.start <= last.end) {
                    // chevauchement, on étend la fin
                    last.end = Math.max(last.end, interval.end);
                } else {
                    merged.push({ ...interval });
                }
            }
        }

        // durée totale occupée en minute
        const totalActiveMinutes = merged.reduce((sum, i) => sum + (i.end - i.start) / 60000, 0);
        return UtilNumber.roundOneDecimal(Math.min(100, ((totalActiveMinutes / totalTime) * 100)));
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