import { PRIORITY } from "./constantes/priority.constante";
import { SAMPLE_TYPE } from "./constantes/sample-type.constante";
import { SPECIALITY } from "./constantes/speciality.constante";
import { inputSimple1, inputSimple2, inputSimple3 } from "./inputs/simple.input";
import { Equipment } from "./interfaces/equipment.class";
import { InputData } from "./interfaces/input-data.class";
import { Metric } from "./interfaces/metric.class";
import { OutputData } from "./interfaces/output-data.class";
import { Sample } from "./interfaces/sample.class";
import { ScheduleEntry } from "./interfaces/schedule-entry.class";
import { ScheduleOutput } from "./interfaces/schedule-output.interface";
import { ScheduleSlot } from "./interfaces/schedule-slot.interface";
import { Technician } from "./interfaces/technician.class";
import { MetricService } from "./services/metric.service";
import { PlannificationService } from "./services/plannification.service";
import { UtilCollection } from "./utils/collection.util";
import { UtilMapper } from "./utils/mapper.util";

function planifyLab(data: InputData): OutputData {
    
    const {samples, technicians, equipment: equipments} = data;
    let schedules: ScheduleEntry[] = [];

    // organisation des données
    const samplesByPriority: Map<PRIORITY, Sample[]> = UtilCollection.groupBy(samples, (s) => s.priority);
    const techniciansBySpeciality: Map<SPECIALITY, Technician[]> = UtilCollection.groupBy(technicians, (t) => t.speciality);
    const equipmentsByType: Map<SAMPLE_TYPE, Equipment[]> = UtilCollection.groupBy(equipments, (e) => e.type);

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
    // TODO: inutile?
    const processedSamples = new Set<string>();

    // traiter les samples STATS
    const statSchedules: ScheduleEntry[] = PlannificationService.getScheduleList(sortedStatSamples, techniciansBySpeciality, equipmentsByType, occupiedSlotsByTechnicianId, occupiedSlotsByEquipmentId);
    schedules = schedules.concat(statSchedules);

    // traiter les samples URGENT
    const urgentSchedules: ScheduleEntry[] = PlannificationService.getScheduleList(sortedUrgentSamples, techniciansBySpeciality, equipmentsByType, occupiedSlotsByTechnicianId, occupiedSlotsByEquipmentId);
    schedules = schedules.concat(urgentSchedules);

    // traiter les samples ROUTINE
    const routineSchedules: ScheduleEntry[] = PlannificationService.getScheduleList(sortedRoutineSamples, techniciansBySpeciality, equipmentsByType, occupiedSlotsByTechnicianId, occupiedSlotsByEquipmentId);
    schedules = schedules.concat(routineSchedules);

    // création des résultats
    const totalTime: number = MetricService.computeTotalTime(samples, schedules);
    const efficiency: number = MetricService.computeEfficiency(schedules, totalTime);
    const conflict: number = MetricService.computeConflicts(occupiedSlotsByTechnicianId, occupiedSlotsByEquipmentId)
    const metric = new Metric(totalTime, efficiency, conflict);

    // formattage des schedules pour affichage des dates
    const formattedSchedules: ScheduleOutput[] = UtilMapper.mapScheduleEntryToOutput(schedules);
    return new OutputData(formattedSchedules, metric);
}

const simpleInput1: InputData = UtilMapper.mapInputData(inputSimple1);
const simpleInput2: InputData = UtilMapper.mapInputData(inputSimple2);
const simpleInput3: InputData = UtilMapper.mapInputData(inputSimple3);

const result1: OutputData = planifyLab(simpleInput1);
const result2: OutputData = planifyLab(simpleInput2);
const result3: OutputData = planifyLab(simpleInput3);

//console.log('result 1 => ', result1);
//console.log('result 2 => ', JSON.stringify(result2, null, 2));
//console.log('result 2 => ', result2);
console.log('result 3 => ', result3);