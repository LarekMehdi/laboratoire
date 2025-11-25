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
import { Technician } from "./interfaces/technician.class";
import { UtilMapper } from "./utils/mapper.util";

function planifyLab(data: InputData): OutputData {
    
    const {samples, technicians, equipment: equipments} = data;

    // creation des maps pour organisation
    const samplesByPriority: Map<PRIORITY, Sample[]> = new Map<PRIORITY, Sample[]>([]);
    const techniciansBySpeciality: Map<SPECIALITY, Technician[]> = new Map<SPECIALITY, Technician[]>([]);
    const equipmentsByType: Map<SAMPLE_TYPE, Equipment[]> = new Map<SAMPLE_TYPE, Equipment[]>([]);

    // tris des données dans les maps
    for (const sample of samples) {
        const p: PRIORITY = sample.priority;
        const sampleList = samplesByPriority.get(p) ?? [];
        sampleList.push(sample);
        samplesByPriority.set(p, sampleList);
    }
    for (const technician of technicians) {
        const s: SPECIALITY = technician.speciality;
        const technicianList: Technician[] = techniciansBySpeciality.get(s) ?? [];
        technicianList.push(technician);
        techniciansBySpeciality.set(s, technicianList);
    }
    for (const equipment of equipments) {
        const t: SAMPLE_TYPE = equipment.type;
        const equipmentList: Equipment[] = equipmentsByType.get(t) ?? [];
        equipmentList.push(equipment);
        equipmentsByType.set(t, equipmentList);
    }

    console.log('samplesByPriority => ', samplesByPriority);
    console.log('techniciansBySpeciality => ', techniciansBySpeciality);
    console.log('equipmentsByType => ', equipmentsByType);

    



    // création des résultats
    const schedules: ScheduleEntry[] = [];
    const totalTime: number = 10;
    const efficiency: number = 100;
    const conflict: number = 0;
    const metric = new Metric(totalTime, efficiency, conflict);
    return new OutputData(schedules, metric);
}

const simpleInput1: InputData = UtilMapper.mapInputData(inputSimple1);

const result1: OutputData = planifyLab(simpleInput1);
//console.log('result 1 => ', result1);