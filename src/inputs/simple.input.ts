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