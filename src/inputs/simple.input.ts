export const inputSimple1 = {
  "samples": [
    {
      "id": "S001",
      "type": "BLOOD", 
      "priority": "URGENT",
      "analysisTime": 30,
      "arrivalTime": "09:00",
      "patientId": "P001"
    }
  ],
  "technicians": [
    {
      "id": "T001", 
      "name": "Alice Martin",
      "speciality": "BLOOD",
      "startTime": "08:00",
      "endTime": "17:00"
    }
  ],
  "equipment": [
    {
      "id": "E001",
      "name": "Analyseur Sang A",
      "type": "BLOOD", 
      "available": true
    }
  ]
}

export const inputSimple2 = {
  "samples": [
    {
      "id": "S001",
      "type": "BLOOD",
      "priority": "URGENT", 
      "analysisTime": 45,
      "arrivalTime": "09:00",
      "patientId": "P001"
    },
    {
      "id": "S002", 
      "type": "BLOOD",
      "priority": "STAT",
      "analysisTime": 30,
      "arrivalTime": "09:30",
      "patientId": "P002"
    }
  ],
  "technicians": [
    {
      "id": "T001",
      "speciality": "BLOOD", 
      "startTime": "08:00",
      "endTime": "17:00"
    }
  ],
  "equipment": [
    {
      "id": "E001",
      "type": "BLOOD",
      "available": true
    }
  ]
}

export const inputSimple3 = {
  "samples": [
    {
      "id": "S001", 
      "type": "BLOOD",
      "priority": "URGENT",
      "analysisTime": 60,
      "arrivalTime": "09:00", 
      "patientId": "P001"
    },
    {
      "id": "S002",
      "type": "URINE", 
      "priority": "URGENT",
      "analysisTime": 30,
      "arrivalTime": "09:15",
      "patientId": "P002" 
    },
    {
      "id": "S003",
      "type": "BLOOD",
      "priority": "ROUTINE", 
      "analysisTime": 45,
      "arrivalTime": "09:00",
      "patientId": "P003"
    }
  ],
  "technicians": [
    {
      "id": "T001",
      "speciality": "BLOOD",
      "startTime": "08:00", 
      "endTime": "17:00"
    },
    {
      "id": "T002", 
      "speciality": "GENERAL",
      "startTime": "08:00",
      "endTime": "17:00"
    }
  ],
  "equipment": [
    {
      "id": "E001",
      "type": "BLOOD",
      "available": true
    },
    {
      "id": "E002", 
      "type": "URINE",
      "available": true
    }
  ]
}

// Test 4 : 2 STAT arrivant en même temps, 1 technicien seulement => ordre par priorité
export const inputSimple4 = {
  samples: [
    { id: "S001", type: "BLOOD", priority: "STAT", analysisTime: 30, arrivalTime: "08:30", patientId: "P001" },
    { id: "S002", type: "BLOOD", priority: "STAT", analysisTime: 30, arrivalTime: "08:30", patientId: "P002" }
  ],
  technicians: [
    { id: "T001", speciality: "BLOOD", startTime: "08:00", endTime: "17:00" }
  ],
  equipment: [
    { id: "E001", type: "BLOOD", available: true }
  ]
};

// Test 5 : mélange STAT + URGENT + ROUTINE, 2 techniciens et 2 équipements => parallélisme
export const inputSimple5 = {
  samples: [
    { id: "S001", type: "BLOOD", priority: "STAT", analysisTime: 30, arrivalTime: "09:00", patientId: "P001" },
    { id: "S002", type: "URINE", priority: "URGENT", analysisTime: 20, arrivalTime: "09:15", patientId: "P002" },
    { id: "S003", type: "BLOOD", priority: "ROUTINE", analysisTime: 45, arrivalTime: "09:30", patientId: "P003" }
  ],
  technicians: [
    { id: "T001", speciality: "BLOOD", startTime: "08:00", endTime: "17:00" },
    { id: "T002", speciality: "GENERAL", startTime: "08:00", endTime: "17:00" }
  ],
  equipment: [
    { id: "E001", type: "BLOOD", available: true },
    { id: "E002", type: "URINE", available: true }
  ]
};

// Test 6 : aucun technicien disponible pour un type spécifique => utiliser GENERAL
export const inputSimple6 = {
  samples: [
    { id: "S001", type: "URINE", priority: "URGENT", analysisTime: 25, arrivalTime: "10:00", patientId: "P001" }
  ],
  technicians: [
    { id: "T001", speciality: "BLOOD", startTime: "08:00", endTime: "17:00" },
    { id: "T002", speciality: "GENERAL", startTime: "08:00", endTime: "17:00" }
  ],
  equipment: [
    { id: "E001", type: "URINE", available: true }
  ]
};

// Test 7 : chevauchement complet sur 1 technicien et 1 équipement => files d’attente
export const inputSimple7 = {
  samples: [
    { id: "S001", type: "BLOOD", priority: "STAT", analysisTime: 30, arrivalTime: "08:00", patientId: "P001" },
    { id: "S002", type: "BLOOD", priority: "URGENT", analysisTime: 30, arrivalTime: "08:15", patientId: "P002" },
    { id: "S003", type: "BLOOD", priority: "ROUTINE", analysisTime: 30, arrivalTime: "08:30", patientId: "P003" }
  ],
  technicians: [
    { id: "T001", speciality: "BLOOD", startTime: "08:00", endTime: "17:00" }
  ],
  equipment: [
    { id: "E001", type: "BLOOD", available: true }
  ]
};

// Test 8 : temps morts pour une efficacité < 100
export const inputSimple8 = {
  samples: [
    {
      id: "S001",
      type: "BLOOD",
      priority: "URGENT",
      analysisTime: 30,
      arrivalTime: "09:00",
      patientId: "P001"
    },
    {
      id: "S002",
      type: "BLOOD",
      priority: "ROUTINE",
      analysisTime: 45,
      arrivalTime: "10:00",
      patientId: "P002"
    },
    {
      id: "S003",
      type: "URINE",
      priority: "ROUTINE",
      analysisTime: 20,
      arrivalTime: "10:30",
      patientId: "P003"
    }
  ],
  technicians: [
    {
      id: "T001",
      speciality: "BLOOD",
      name: "Alice",
      startTime: "08:00",
      endTime: "17:00"
    },
    {
      id: "T002",
      speciality: "URINE",
      name: "Bob",
      startTime: "08:00",
      endTime: "17:00"
    }
  ],
  equipment: [
    {
      id: "E001",
      type: "BLOOD",
      name: "Analyseur Sang",
      available: true
    },
    {
      id: "E002",
      type: "URINE",
      name: "Analyseur Urine",
      available: true
    }
  ]
};