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
import { PatientInfo } from "../classes/patient-info.class";
import { Laboratory } from "../classes/laboratory.class";
import { Constraint } from "../classes/constraint.class";

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

    // TODO: fusionner les deux mapper + refacto
    static mapIntermediaryInputData(raw: RawIntermediaryInputData): InputData {
        const samples: Sample[] = [];
        for (const rawSample of raw.samples) {
            const s: Sample = new Sample(
                rawSample.id,
                this.toEnum<SAMPLE_TYPE>(rawSample.type, SAMPLE_TYPE), 
                this.toEnum<PRIORITY>(rawSample.priority, PRIORITY), 
                rawSample.analysisTime, 
                UtilDate.parseStringToTime(rawSample.arrivalTime),
            );
            s.analysisType = rawSample.analysisType;
            // TODO: PatientInfo
            //s.patientInfo = new PatientInfo(rawSample.patientInfo?.age, rawSample.patientInfo?.service, rawSample.patientInfo?.diagnosis);

            samples.push(s);
        }
  
        const technicians: Technician[] = [];
        for (const rawTechnician of raw.technicians) {
            const t: Technician = new Technician(
                rawTechnician.id, 
                this.toEnums<SPECIALITY>(rawTechnician.specialty, SPECIALITY), 
                UtilDate.parseStringToTime(rawTechnician.startTime),
                UtilDate.parseStringToTime(rawTechnician.endTime),
                rawTechnician.name,
            );
            t.efficiency = rawTechnician.efficiency;
            t.lunchBreak = UtilDate.parseStringToTime(rawTechnician.lunchBreak);
            technicians.push(t);
        }

        const equipments: Equipment[] = [];
        for (const rawEquipment of raw.equipment) {
            const e: Equipment = new Equipment(
                rawEquipment.id, 
                this.toEnum<SAMPLE_TYPE>(rawEquipment.type, SAMPLE_TYPE), 
                rawEquipment.name
            );
            e.compatibleTypes = rawEquipment.compatibleTypes;
            e.capacity = rawEquipment.capacity;
            e.maintenanceWindow = UtilDate.parseStringToTime(rawEquipment.maintenanceWindow);
            e.cleaningTime = rawEquipment.cleaningTime;
            equipments.push(e);
        }
        

        // laboratory
        // const laboratory: Laboratory = new Laboratory(
        //     raw.laboratory.name,
        //     raw.laboratory.openingHours, // parser une string en 2 dates
        //     raw.laboratory.date
        // );

        // constraint
        const constraint: Constraint = new Constraint(
            raw.constraints.maxProcessingTime,
            this.toEnums<PRIORITY>(raw.constraints.priorityRules, PRIORITY), 
            raw.constraints.contaminationPrevention,
            raw.constraints.parallelProcessing
        );

        const inputData: InputData = new InputData(samples, technicians, equipments);
        //inputData.laboratory = laboratory;
        inputData.constraints = constraint;
        return inputData;
    }

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