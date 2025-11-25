import { PRIORITY } from "./constantes/priority.constante";
import { SAMPLE_TYPE } from "./constantes/sample-type.constante";
import { SPECIALITY } from "./constantes/speciality.constante";
import { inputSimple1 } from "./inputs/simple.input";
import { Equipment } from "./interfaces/equipment.class";
import { InputData } from "./interfaces/input-data.class";
import { Metric } from "./interfaces/metric.class";
import { OutputData } from "./interfaces/output-data.class";
import { Sample } from "./interfaces/sample.class";
import { ScheduleEntry } from "./interfaces/schedule-entry.class";
import { ScheduleSlot } from "./interfaces/schedule-slot.interface";
import { Technician } from "./interfaces/technician.class";
import { UtilCollection } from "./utils/collection.util";
import { UtilDate } from "./utils/date.util";
import { UtilMapper } from "./utils/mapper.util";

function planifyLab(data: InputData): OutputData {
    
    const {samples, technicians, equipment: equipments} = data;
    const schedules: ScheduleEntry[] = [];

    // organisation des données
    const samplesByPriority: Map<PRIORITY, Sample[]> = UtilCollection.groupBy(samples, (s) => s.priority);
    const techniciansBySpeciality: Map<SPECIALITY, Technician[]> = UtilCollection.groupBy(technicians, (t) => t.speciality);
    const equipmentsByType: Map<SAMPLE_TYPE, Equipment[]> = UtilCollection.groupBy(equipments, (e) => e.type);

    // console.log('samplesByPriority => ', samplesByPriority);
    // console.log('techniciansBySpeciality => ', techniciansBySpeciality);
    // console.log('equipmentsByType => ', equipmentsByType);

    // traitement des échantillons par priorités
    const statSamples: Sample[] = samplesByPriority.get(PRIORITY.STAT) ?? [];
    const urgentSamples: Sample[] = samplesByPriority.get(PRIORITY.URGENT) ?? [];
    const routineSamples: Sample[] = samplesByPriority.get(PRIORITY.ROUTINE) ?? [];

    // rangement des samples par heure d'arrivée
    const sortedStatSamples: Sample[] = UtilCollection.sortBy(statSamples, (s) => s.arrivalTime);
    const sortedUrgentSamples: Sample[] = UtilCollection.sortBy(urgentSamples, (s) => s.arrivalTime);
    const sortedRoutineSamples: Sample[] = UtilCollection.sortBy(routineSamples, (s) => s.arrivalTime);

    // mettre a jour la non dispo des ressources
    const occupiedSlotsByEquipmentId: Map<string, ScheduleSlot[]> = new Map<string, ScheduleSlot[]>();
    const occupiedSlotsByTechnicianId: Map<string, ScheduleSlot[]> = new Map<string, ScheduleSlot[]>();

    // garder une trace des échantillons traités
    const processedSamples = new Set<string>();

    // traiter les samples STATS


    // traiter les samples URGENT
    for (const sample of sortedUrgentSamples) {
        // liste des techos
        let spe: SPECIALITY = findTechnicianSpecialityForSampleType(sample.type);
        const technicianList: Technician[] = techniciansBySpeciality.get(spe) ?? [];
        // liste des équipement
        const equipmentList: Equipment[] = equipmentsByType.get(sample.type) ?? [];


        // TODO: constante maxDate
        const technicianSlots = technicianList.map(t => getAvailableSlots(occupiedSlotsByTechnicianId.get(t.id) ?? [], sample.arrivalTime, new Date("2100-01-01"))).flat();
        const equipmentSlots = equipmentList.map(e => getAvailableSlots(occupiedSlotsByEquipmentId.get(e.id) ?? [], sample.arrivalTime, new Date("2100-01-01"))).flat();

        // trouver le premier créneau commun
        const occupiedSlot = findEarliestCommonSlot(technicianSlots, equipmentSlots, sample.arrivalTime, sample.analysisTime);

        // on prends le premier de chaques
        const technician = technicianList[0];
        const equipment = equipmentList[0];

        // maj des slots occupés
        occupiedSlotsByTechnicianId.set(technician.id, [
            ...(occupiedSlotsByTechnicianId.get(technician.id) ?? []),
            occupiedSlot
        ]);

        occupiedSlotsByEquipmentId.set(equipment.id, [
            ...(occupiedSlotsByEquipmentId.get(equipment.id) ?? []),
            occupiedSlot
        ]);

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


        console.log('occupiedSlot urgent => ', occupiedSlot);
    }

    // traiter les samples ROUTINE

    






    // création des résultats
    const totalTime: number = 10;
    const efficiency: number = 100;
    const conflict: number = 0;
    const metric = new Metric(totalTime, efficiency, conflict);
    return new OutputData(schedules, metric);
}

function findTechnicianSpecialityForSampleType(sampleType: SAMPLE_TYPE) {
    switch(sampleType) {
        case SAMPLE_TYPE.BLOOD: return SPECIALITY.BLOOD;
        case SAMPLE_TYPE.TISSUE: return SPECIALITY.TISSUE;
        case SAMPLE_TYPE.URINE: return SPECIALITY.URINE;
        default: return SPECIALITY.GENERAL;
    }
}

function findEarliestCommonSlot(technicianSlots: ScheduleSlot[], equipmentSlots: ScheduleSlot[], arrivalTime: Date, duration: number): ScheduleSlot {
    for (const technicianSlot of technicianSlots) {
        for (const equipmentSlot of equipmentSlots) {
            const start = new Date(Math.max(technicianSlot.start.getTime(), equipmentSlot.start.getTime(), arrivalTime.getTime()));
            const end = UtilDate.addMinutes(start, duration);
            if (end <= technicianSlot.end && end <= equipmentSlot.end) {
                return { start, end };
            }
        }
    }
    // TODO: prendre un technicien GENERAL
    throw new Error("No available common slot");
}

function getAvailableSlots(occupied: ScheduleSlot[], workStart: Date, workEnd: Date): ScheduleSlot[] {
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

const simpleInput1: InputData = UtilMapper.mapInputData(inputSimple1);

const result1: OutputData = planifyLab(simpleInput1);
//console.log('result 1 => ', result1);