import { PRIORITY } from "../constantes/priority.constante";
import { SAMPLE_TYPE } from "../constantes/sample-type.constante";
import { SPECIALITY } from "../constantes/speciality.constante";
import { InputData } from "../classes/input-data.class";
import { Metric } from "../classes/metric.class";
import { ScheduleEntry } from "../classes/schedule-entry.class";
import { ScheduleOutput } from "../interfaces/schedule-output.interface";
import { ScheduleSlot } from "../interfaces/schedule-slot.interface";
import { MetricService } from "./metric.service";
import { PlannificationService } from "./plannification.service";
import { UtilCollection } from "../utils/collection.util";
import { UtilMapper } from "../utils/mapper.util";
import { Equipment } from "../classes/equipment.class";
import { OutputData } from "../classes/output-data.class";
import { Sample } from "../classes/sample.class";
import { Technician } from "../classes/technician.class";

export abstract class LabService {

    static planifyLab(data: InputData): OutputData {
    
        const {samples, technicians, equipment: equipments} = data;
        let schedules: ScheduleEntry[] = [];

        // organisation des données
        const samplesByPriority: Map<PRIORITY, Sample[]> = UtilCollection.groupBy(samples, (s) => s.priority);
        const techniciansBySpeciality: Map<SPECIALITY, Technician[]> = UtilCollection.groupBy(technicians, (t) => t.speciality);
        const equipmentsByType: Map<SAMPLE_TYPE, Equipment[]> = UtilCollection.groupBy(equipments, (e) => e.type);
        const occupiedSlotsByEquipmentId: Map<string, ScheduleSlot[]> = new Map<string, ScheduleSlot[]>();
        const occupiedSlotsByTechnicianId: Map<string, ScheduleSlot[]> = new Map<string, ScheduleSlot[]>();

        // traiter les samples par priority
        for (const priority of Object.values(PRIORITY)) {
            const samplesForPriority = samplesByPriority.get(priority) ?? [];
            schedules = schedules.concat(PlannificationService.getScheduleList(samplesForPriority, techniciansBySpeciality, equipmentsByType, occupiedSlotsByTechnicianId, occupiedSlotsByEquipmentId));
        }

        // création des résultats
        const metric: Metric = MetricService.computeMetrics(samples, schedules, occupiedSlotsByTechnicianId, occupiedSlotsByEquipmentId);

        // formattage des schedules pour affichage des dates
        const formattedSchedules: ScheduleOutput[] = UtilMapper.mapScheduleEntryToOutput(schedules.sort((a, b) => a.startTime.getTime() - b.startTime.getTime()));
        return new OutputData(formattedSchedules, metric);
    }
}



