import { Sample } from "../classes/sample.class";
import { ScheduleEntry } from "../classes/schedule-entry.class";
import { ScheduleSlot } from "../interfaces/schedule-slot.interface";
import { UtilNumber } from "../utils/number.util";

export abstract class MetricService {


    // - **Temps total** : Durée entre le début de la première analyse et la fin de la dernière analyse
    static computeTotalTime(samples: Sample[], schedules: ScheduleEntry[]): number {
        if (schedules.length === 0) return 0;
        const minArrival = Math.min(...samples.map(s => s.arrivalTime.getTime()));
        const maxEnd = Math.max(...schedules.map(s => s.endTime.getTime()));
        return (maxEnd - minArrival) / 60000;
    }

    // % de temps où les ressources sont utilisées
    // (temps actif) / (temps total) * 100
    // - **Somme des durées** : Addition de tous les `analysisTime` des échantillons
    // - **Temps total** : Durée entre le début de la première analyse et la fin de la dernière analyse
    // - **En cas de parallélisme** : Les durées s'additionnent même si les analyses sont simultanées
    static computeEfficiency(samples: Sample[], schedules: ScheduleEntry[], totalTime: number): number {
        if (schedules.length === 0) return 0;
        const totalAnalysisTime: number = samples.reduce((sum, s) => sum + s.analysisTime, 0);
        const efficiency: number = Math.min((totalAnalysisTime / totalTime) * 100, 100);
        return UtilNumber.roundOneDecimal(efficiency);
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