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
  name: string;
  speciality: string;
  startTime: string;
  endTime: string;
}

export interface RawEquipment {
  id: string;
  name: string;
  type: string;
  available: boolean;
}

export interface RawInputData {
  samples: RawSample[];
  technicians: RawTechnician[];
  equipment: RawEquipment[];
}