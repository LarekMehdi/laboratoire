import { PRIORITY } from "../constantes/priority.constante";
import { SAMPLE_TYPE } from "../constantes/sample-type.constante";
import { SPECIALITY } from "../constantes/speciality.constante";
import { InputData } from "../classes/input-data.class";
import { RawEquipment, RawInputData, RawSample, RawTechnician } from "../interfaces/raw.interface";
import { ScheduleEntry } from "../classes/schedule-entry.class";
import { ScheduleOutput } from "../interfaces/schedule-output.interface";
import { UtilDate } from "./date.util";
import { Equipment } from "../classes/equipment.class";
import { Sample } from "../classes/sample.class";
import { Technician } from "../classes/technician.class";

export abstract class UtilMapper {

    // RAW DATA

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
                t.id, 
                this.toEnum<SPECIALITY>(t.speciality, SPECIALITY), 
                UtilDate.parseStringToTime(t.startTime),
                UtilDate.parseStringToTime(t.endTime),
                t.name
            ));

        const equipment = raw.equipment.map((e: RawEquipment) => 
            new Equipment( 
                e.id, 
                this.toEnum<SAMPLE_TYPE>(e.type, SAMPLE_TYPE), 
                e.available,
                e.name
            ));

        return new InputData(samples, technicians, equipment);
    }

    // ENUM

    static toEnum<T>(value: string, enumType: Record<string, T>): T {
        if (!Object.values(enumType).includes(value as T)) {
            throw new Error(`Invalid enum value: ${value}`);
        }
        return value as T;
    }

    // OUTPUT

    static mapScheduleEntryToOutput(scheduleEntries: ScheduleEntry[]): ScheduleOutput[] {
        const scheduleOutputs: ScheduleOutput[] = [];
        for (const scheduleE of scheduleEntries) {
            const formattedStartTime: string = UtilDate.formatDateToHHMM(scheduleE.startTime);
            const formattedEndTime: string = UtilDate.formatDateToHHMM(scheduleE.endTime);
            const scheduleO: ScheduleOutput = {
                sampleId: scheduleE.sampleId,
                technicianId: scheduleE.technicianId,
                equipmentId: scheduleE.equipmentId,
                startTime: formattedStartTime,
                endTime: formattedEndTime,
                priority: scheduleE.priority
            }
            scheduleOutputs.push(scheduleO);
        }

        return scheduleOutputs;
    }
}