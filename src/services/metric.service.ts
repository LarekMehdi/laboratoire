import { ScheduleEntry } from "../interfaces/schedule-entry.class";
import { ScheduleSlot, ScheduleSlotMillisecond } from "../interfaces/schedule-slot.interface";
import { UtilDate } from "../utils/date.util";
import { UtilNumber } from "../utils/number.util";

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

    //TODO: a supprimer
    static computeEfficiency2(occupiedSlotsByTechnicianId: Map<string, ScheduleSlot[]>, occupiedSlotsByEquipmentId: Map<string, ScheduleSlot[]>, totalTime: number): number {
        if (totalTime === 0) return 0;

        // on prends tous les slots
        const allSlots: ScheduleSlot[] = [...Array.from(occupiedSlotsByTechnicianId.values()).flat(), ...Array.from(occupiedSlotsByEquipmentId.values()).flat()];

        // si aucun créneaux occupé
        if (allSlots.length === 0) return 0;
        
        // créer un Set de toutes les minutes couvertes
        const minutesSet = new Set<number>();
        for (const slot of allSlots) {
            let t = slot.start.getTime();
            const end = slot.end.getTime();
            while (t < end) {
                minutesSet.add(t);
                t += 60000; // 1 minute
            }
        }

        const totalActiveMinutes = minutesSet.size;
        return UtilNumber.roundOneDecimal(Math.min((totalActiveMinutes / totalTime) * 100, 100));
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