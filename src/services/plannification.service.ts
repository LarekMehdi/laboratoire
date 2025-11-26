import { SAMPLE_TYPE } from "../constantes/sample-type.constante";
import { MAX_DATE } from "../constantes/settings.constante";
import { SPECIALITY } from "../constantes/speciality.constante";
import { ScheduleEntry } from "../classes/schedule-entry.class";
import { ScheduleSlot } from "../interfaces/schedule-slot.interface";
import { UtilCollection } from "../utils/collection.util";
import { UtilConstante } from "../utils/constante.util";
import { UtilDate } from "../utils/date.util";
import { Equipment } from "../classes/equipment.class";
import { Sample } from "../classes/sample.class";
import { Technician } from "../classes/technician.class";
import { HasId } from "../interfaces/has-id.interface";
import { UtilEntity } from "../utils/entity.util";
import { SlotWithTechnicianList } from "../interfaces/slot.interface";
import { NoSlotError } from "../errors/no-slot.error";

export abstract class PlannificationService {

    // trouve les créneaux dispo
    static getScheduleList(samples: Sample[], techniciansBySpeciality: Map<SPECIALITY, Technician[]>, equipmentsByType: Map<SAMPLE_TYPE, Equipment[]>, occupiedSlotsByTechnicianId: Map<string, ScheduleSlot[]>, occupiedSlotsByEquipmentId: Map<string, ScheduleSlot[]>): ScheduleEntry[] {
        const schedules: ScheduleEntry[] = []

        for (const sample of samples) {
            // récupération des ressources pour la spécialité
            let spe: SPECIALITY = UtilConstante.findTechnicianSpecialityForSampleType(sample.type);
            let technicianList: Technician[] = techniciansBySpeciality.get(spe) ?? [];
            const equipmentList: Equipment[] = equipmentsByType.get(sample.type) ?? [];

            let technicianSlots = this.__buildSlotsForResources(technicianList, occupiedSlotsByTechnicianId, sample.arrivalTime);
            const equipmentSlots = this.__buildSlotsForResources(equipmentList, occupiedSlotsByEquipmentId, sample.arrivalTime);
    
            // trouver le premier créneau commun
            const { slot: occupiedSlot, technicianList: realTechList}: SlotWithTechnicianList = this.__findSlotWithFallback(technicianList, technicianSlots, equipmentSlots, sample, techniciansBySpeciality, occupiedSlotsByTechnicianId);

            // premiere ressource dispo
            const technician: Technician = UtilCollection.pickResourceForSlot<Technician>(realTechList, occupiedSlot, occupiedSlotsByTechnicianId);
            const equipment: Equipment = UtilCollection.pickResourceForSlot<Equipment>(equipmentList, occupiedSlot, occupiedSlotsByEquipmentId);
    
            // maj des slots occupés
            occupiedSlotsByTechnicianId.set(technician.id, [...(occupiedSlotsByTechnicianId.get(technician.id) ?? []), occupiedSlot]);
            occupiedSlotsByEquipmentId.set(equipment.id, [...(occupiedSlotsByEquipmentId.get(equipment.id) ?? []), occupiedSlot]);
    
            // création du schedule pour résultat final
            schedules.push(UtilEntity.createScheduleEntry(sample, technician, equipment, occupiedSlot));
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
        throw new NoSlotError(arrivalTime, duration);
    }

    private static __buildSlotsForResources(resources: HasId[], occupied: Map<string, ScheduleSlot[]>, start: Date): ScheduleSlot[] {
        return resources.map(r => this.getAvailableSlots(occupied.get(r.id) ?? [], start, MAX_DATE)).flat();
    }

    private static __findSlotWithFallback(technicianList: Technician[], technicianSlots: ScheduleSlot[], 
                equipmentSlots: ScheduleSlot[], sample: Sample, techniciansBySpeciality: Map<SPECIALITY, Technician[]>, occupiedSlotsByTechnicianId: Map<string, ScheduleSlot[]>): SlotWithTechnicianList {
        try {
            // spécialité normale
            const slot: ScheduleSlot = this.findEarliestCommonSlot(technicianSlots, equipmentSlots, sample.arrivalTime, sample.analysisTime);
            return {slot, technicianList}
        } catch(err: unknown) {
            if (err instanceof NoSlotError) {
                // spécialité GENERAL
                const generalTechs = techniciansBySpeciality.get(SPECIALITY.GENERAL) ?? [];

                if (generalTechs.length === 0) throw new NoSlotError(sample.arrivalTime, sample.analysisTime, "No slot found for general technician");

                technicianList = generalTechs;
                const generalSlots: ScheduleSlot[] = this.__buildSlotsForResources(generalTechs, occupiedSlotsByTechnicianId, sample.arrivalTime);

                const slot: ScheduleSlot = this.findEarliestCommonSlot(generalSlots, equipmentSlots, sample.arrivalTime, sample.analysisTime);                
                return {slot, technicianList} 
            } else {
                throw err;
            }
            
        }
    }

    
}