import { PRIORITY } from "../constantes/priority.constante";
import { SAMPLE_TYPE } from "../constantes/sample-type.constante";
import { SPECIALITY } from "../constantes/speciality.constante";
import { Equipment } from "../interfaces/equipment.class";
import { InputData } from "../interfaces/input-data.class";
import { RawEquipment, RawInputData, RawSample, RawTechnician } from "../interfaces/raw.interface";
import { Sample } from "../interfaces/sample.class";
import { Technician } from "../interfaces/technician.class";
import { UtilDate } from "./date.util";

export abstract class UtilMapper {

    static mapInputData(raw: RawInputData): InputData {
        const samples = raw.samples.map((s: RawSample) => 
            new Sample(
                s.id,
                this.toEnum<SAMPLE_TYPE>(s.type, SAMPLE_TYPE), 
                this.toEnum<PRIORITY>(s.priority, PRIORITY), 
                s.analysisTime, 
                UtilDate.parseStringToTime(s.arrivalTime),
                s.patientId
            ));

        const technicians = raw.technicians.map((t: RawTechnician) => 
            new Technician(
                t.id, t.name, 
                this.toEnum<SPECIALITY>(t.speciality, SPECIALITY), 
                UtilDate.parseStringToTime(t.startTime),
                UtilDate.parseStringToTime(t.endTime)
            ));

        const equipment = raw.equipment.map((e: RawEquipment) => 
            new Equipment( 
                e.id, e.name, 
                this.toEnum<SAMPLE_TYPE>(e.type, SAMPLE_TYPE), 
                e.available
            ));

        return new InputData(samples, technicians, equipment);
    }

    static toEnum<T>(value: string, enumType: Record<string, T>): T {
        if (!Object.values(enumType).includes(value as T)) {
            throw new Error(`Invalid enum value: ${value}`);
        }
        return value as T;
    }
}