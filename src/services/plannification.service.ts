import { SAMPLE_TYPE } from "../constantes/sample-type.constante";
import { MAX_DATE } from "../constantes/settings.constante";
import { SPECIALITY } from "../constantes/speciality.constante";
import { Equipment } from "../interfaces/equipment.class";
import { Sample } from "../interfaces/sample.class";
import { ScheduleEntry } from "../interfaces/schedule-entry.class";
import { ScheduleSlot } from "../interfaces/schedule-slot.interface";
import { Technician } from "../interfaces/technician.class";
import { UtilCollection } from "../utils/collection.util";
import { UtilConstante } from "../utils/constante.util";
import { UtilDate } from "../utils/date.util";

export abstract class PlannificationService {

    // trouve les créneaux dispo
    static getScheduleList(samples: Sample[], techniciansBySpeciality: Map<SPECIALITY, Technician[]>, equipmentsByType: Map<SAMPLE_TYPE, Equipment[]>, occupiedSlotsByTechnicianId: Map<string, ScheduleSlot[]>, occupiedSlotsByEquipmentId: Map<string, ScheduleSlot[]>): ScheduleEntry[] {
        const schedules: ScheduleEntry[] = []

        for (const sample of samples) {
            // liste des techos
            let spe: SPECIALITY = UtilConstante.findTechnicianSpecialityForSampleType(sample.type);
            let technicianList: Technician[] = techniciansBySpeciality.get(spe) ?? [];
            // liste des équipement
            const equipmentList: Equipment[] = equipmentsByType.get(sample.type) ?? [];
    
            let technicianSlots = technicianList.map(t => this.getAvailableSlots(occupiedSlotsByTechnicianId.get(t.id) ?? [], sample.arrivalTime, MAX_DATE)).flat();
            const equipmentSlots = equipmentList.map(e => this.getAvailableSlots(occupiedSlotsByEquipmentId.get(e.id) ?? [], sample.arrivalTime, MAX_DATE)).flat();
    

            // trouver le premier créneau commun
            let occupiedSlot: ScheduleSlot;
            try {
                // spécialité normale
                occupiedSlot = this.findEarliestCommonSlot(technicianSlots, equipmentSlots, sample.arrivalTime, sample.analysisTime);
            } catch(err: unknown) {
                // spécialité GENERAL
                const generalTechs = techniciansBySpeciality.get(SPECIALITY.GENERAL) ?? [];

                if (generalTechs.length === 0) throw new Error("No available common slot, even with general technician");

                technicianList = generalTechs;
                technicianSlots = generalTechs.map(t => this.getAvailableSlots(occupiedSlotsByTechnicianId.get(t.id) ?? [], sample.arrivalTime, MAX_DATE)).flat();

                occupiedSlot = this.findEarliestCommonSlot(technicianSlots, equipmentSlots, sample.arrivalTime, sample.analysisTime);
            }
            
    
            // premiere ressource dispo
            const technician: Technician = UtilCollection.pickResourceForSlot<Technician>(technicianList, occupiedSlot, occupiedSlotsByTechnicianId);
            const equipment: Equipment = UtilCollection.pickResourceForSlot<Equipment>(equipmentList, occupiedSlot, occupiedSlotsByEquipmentId);
    
            // maj des slots occupés
            occupiedSlotsByTechnicianId.set(technician.id, [...(occupiedSlotsByTechnicianId.get(technician.id) ?? []), occupiedSlot]);
            occupiedSlotsByEquipmentId.set(equipment.id, [...(occupiedSlotsByEquipmentId.get(equipment.id) ?? []), occupiedSlot]);
    
            // création du schedule pour résultat final
            const schedule: ScheduleEntry = {
                sampleId: sample.id,
                technicianId: technician.id,
                equipmentId: equipment.id,
                startTime: occupiedSlot.start,
                endTime: occupiedSlot.end,
                priority: sample.priority
            };
            schedules.push(schedule);
        }
        return schedules;
    }

    static getAvailableSlots(occupied: ScheduleSlot[], workStart: Date, workEnd: Date): ScheduleSlot[] {
        const sorted = occupied.slice().sort((a, b) => a.start.getTime() - b.start.getTime());
        const free: ScheduleSlot[] = [];
        let current = workStart;
    
        for (const slot of sorted) {
            if (slot.start > current) free.push({ start: current, end: slot.start });
            current = new Date(Math.max(current.getTime(), slot.end.getTime()));
        }
        if (current < workEnd) free.push({ start: current, end: workEnd });
        
        return free;
    }

    static findEarliestCommonSlot(technicianSlots: ScheduleSlot[], equipmentSlots: ScheduleSlot[], arrivalTime: Date, duration: number): ScheduleSlot {
        for (const technicianSlot of technicianSlots) {
            for (const equipmentSlot of equipmentSlots) {
                const start = new Date(Math.max(technicianSlot.start.getTime(), equipmentSlot.start.getTime(), arrivalTime.getTime()));
                const end = UtilDate.addMinutes(start, duration);
                if (end <= technicianSlot.end && end <= equipmentSlot.end) {
                    return { start, end };
                }
            }
        }
        // TODO: erreur personnalisée
        throw new Error("No available common slot");
    }
}