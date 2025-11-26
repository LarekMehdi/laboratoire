import { ScheduleSlot } from "../interfaces/schedule-slot.interface";
import { UtilDate } from "../utils/date.util";

export const EQUIPMENT_UNAVAILABILITY: Record<string, ScheduleSlot> = {
    EQ001: { start: UtilDate.parseStringToTime("06:00"), end: UtilDate.parseStringToTime("07:00") },
    EQ002: { start: UtilDate.parseStringToTime("06:30"), end: UtilDate.parseStringToTime("07:30") },
    EQ003: { start: UtilDate.parseStringToTime("07:00"), end: UtilDate.parseStringToTime("08:00") },
    EQ004: { start: UtilDate.parseStringToTime("05:30"), end: UtilDate.parseStringToTime("06:30") },
    EQ005: { start: UtilDate.parseStringToTime("19:00"), end: UtilDate.parseStringToTime("20:00") },
}

// deux échantillons similaires l'un aprés l'autre sur meme equipement déclenchent un netoyage entre les deux?
export enum EQUIPMENT_CLEANING_DURATION {
    HEMATOLOGY = 10,
    BIOCHEMISTRY = 15,
    MICROBIOLOGY = 20,
    IMMUNOLOGY = 12,
    GENETIC = 30,
}