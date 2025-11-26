export interface RawSample {
  id: string;
  type: string;
  priority: string;
  analysisTime: number;
  arrivalTime: string;
  patientId: string;
}

export interface RawTechnician {
  id: string;
  name?: string;
  speciality: string;
  startTime: string;
  endTime: string;
}

export interface RawEquipment {
  id: string;
  name?: string;
  type: string;
  available: boolean;
}

export interface RawInputData {
  samples: RawSample[];
  technicians: RawTechnician[];
  equipment: RawEquipment[];
}

//////////////////////////////////////////////////////

export interface RawIntermediaryInputData {
  laboratory: RawLaboratory;
  samples: RawIntermediarySample[];
  technicians: RawIntermediaryTechnician[];
  equipment: RawIntermediaryEquipment[];
  constraints: RawIntermediaryConstraint;
}

export interface RawLaboratory {
  name: string;
  openingHours: string;
  date: string;
}

export interface RawPatientInfo {
  age: number;
  service: string;
  diagnosis: string;
}

export interface RawIntermediarySample {
  id: string;
  priority: string;
  type: string;
  analysisType: string;
  analysisTime: number;
  arrivalTime: string;
  patientInfo: RawPatientInfo;
}

export interface RawIntermediaryTechnician {
  id: string;
  name: string;
  specialty: string[];
  efficiency: number;
  startTime: string;
  endTime: string;
  lunchBreak: string;
}

export interface RawIntermediaryEquipment {
  id: string;
  name: string;
  type: string;
  compatibleTypes: string[];
  capacity: number;
  maintenanceWindow: string;
  cleaningTime: number;
}

export interface RawIntermediaryConstraint {
  maxProcessingTime: number;
  priorityRules: string[];
  contaminationPrevention: boolean;
  parallelProcessing: boolean;
}