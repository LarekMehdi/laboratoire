import { PRIORITY } from "../constantes/priority.constante";
import { SAMPLE_TYPE } from "../constantes/sample-type.constante";
import { SPECIALITY } from "../constantes/speciality.constante";
import { InputData } from "../classes/input-data.class";
import { RawEquipment, RawInputData, RawIntermediaryEquipment, RawIntermediaryInputData, RawIntermediarySample, RawIntermediaryTechnician, RawSample, RawTechnician } from "../interfaces/raw.interface";
import { ScheduleEntry } from "../classes/schedule-entry.class";
import { ScheduleOutput } from "../interfaces/schedule-output.interface";
import { UtilDate } from "./date.util";
import { Equipment } from "../classes/equipment.class";
import { Sample } from "../classes/sample.class";
import { Technician } from "../classes/technician.class";
import { InvalidEnumValueError } from "../errors/invalid-enum-value.error";

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
                this.toEnums<SPECIALITY>([t.speciality], SPECIALITY), 
                UtilDate.parseStringToTime(t.startTime),
                UtilDate.parseStringToTime(t.endTime),
                t.name
            ));

        const equipment = raw.equipment.map((e: RawEquipment) => 
            new Equipment( 
                e.id, 
                this.toEnum<SAMPLE_TYPE>(e.type, SAMPLE_TYPE),
                e.name, 
                e.available,
            ));

        return new InputData(samples, technicians, equipment);
    }

    // TODO: fussionner les deux mapper
    // static mapIntermediaryInputData(raw: RawIntermediaryInputData): InputData {
    //     const samples = raw.samples.map((s: RawIntermediarySample) => 
    //         new Sample(
    //             s.id,
    //             this.toEnum<SAMPLE_TYPE>(s.type, SAMPLE_TYPE), 
    //             this.toEnum<PRIORITY>(s.priority, PRIORITY), 
    //             s.analysisTime, 
    //             UtilDate.parseStringToTime(s.arrivalTime),

    //         ));

    //     const technicians = raw.technicians.map((t: RawIntermediaryTechnician) => 
    //         new Technician(
    //             t.id, 
    //             this.toEnums<SPECIALITY>(t.specialty, SPECIALITY), 
    //             UtilDate.parseStringToTime(t.startTime),
    //             UtilDate.parseStringToTime(t.endTime),
    //             t.name,

    //         ));

    //     const equipment = raw.equipment.map((e: RawIntermediaryEquipment) => 
    //         new Equipment( 
    //             e.id, 
    //             this.toEnum<SAMPLE_TYPE>(e.type, SAMPLE_TYPE), 
                
    //             e.name
    //         ));

    //     // laboratory

    //     // constraint

    //     const inputData: InputData = new InputData(samples, technicians, equipment);
    //     return inputData;
    // }

    // ENUM

    static toEnum<T>(value: string, enumType: Record<string, T>): T {
        if (!Object.values(enumType).includes(value as T)) {
            throw new InvalidEnumValueError(value);
        }
        return value as T;
    }

    static toEnums<T>(values: string[], enumType: Record<string, T>): T[] {
    return values.map(value => {
        if (!Object.values(enumType).includes(value as T)) {
            throw new InvalidEnumValueError(value);
        }
        return value as T;
    });
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